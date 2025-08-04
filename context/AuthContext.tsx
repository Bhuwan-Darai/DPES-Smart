import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "expo-router";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "@/lib/graphql/auth";
import {
  clearTokens,
  client,
  getAccessToken,
  saveTokens,
  manualRefreshToken,
  setLogoutState,
  forceClearApolloCache,
} from "@/lib/apollo/client";
import { getDeviceId } from "@/lib/utils/device";
import * as SecureStore from "expo-secure-store";

interface UserDetails {
  id: string;
  name: string;
  email: string;
  schoolId: string;
  role: string;
  [key: string]: any;
}

interface SavedCredential {
  schoolId: string;
  email?: string;
  uniqueId?: string;
  name: string;
  password: string;
  lastLogin: string;
  source: string;
  authId: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userDetails: UserDetails | null;
  login: (input: LoginInput) => Promise<UserDetails | null>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<UserDetails | null>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  checkAndRefreshToken: () => Promise<boolean>;
  loginLoading: boolean;
  registerLoading: boolean;
  loginError: any;
  registerError: any;
  savedCredentials: SavedCredential[];
  removeSavedCredential: (email: string) => Promise<void>;
}

interface LoginInput {
  email?: string;
  uniqueId?: string;
  password: string;
  source: string;
  deviceId?: string;
  ip?: string;
  userAgent?: string;
  os?: string;
  deviceType?: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [savedCredentials, setSavedCredentials] = useState<SavedCredential[]>(
    []
  );
  const [login, { loading: loginLoading, error: loginError }] =
    useMutation(LOGIN_MUTATION);
  const [register, { loading: registerLoading, error: registerError }] =
    useMutation(REGISTER_MUTATION);
  const router = useRouter();

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const token = await getAccessToken();
        const userDetailsString = await SecureStore.getItemAsync("userDetails");
        const savedCredsString = await SecureStore.getItemAsync(
          "savedCredentials"
        );

        console.log("Token exists:", !!token);
        console.log("User details exist:", !!userDetailsString);
        console.log("Saved credentials exist:", !!savedCredsString);

        if (savedCredsString) {
          setSavedCredentials(JSON.parse(savedCredsString));
        }

        if (token && userDetailsString) {
          const parsedUserDetails = JSON.parse(userDetailsString);

          // Check if token is expired before attempting validation
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const expiration = new Date(payload.exp * 1000);
            const now = new Date();

            console.log("Token expires at:", expiration);
            console.log("Current time:", now);
            console.log("Token expired:", expiration < now);

            if (expiration < now) {
              console.log("Token is expired, attempting refresh");
              const isValid = await handleRefreshTokens();
              if (isValid) {
                setIsAuthenticated(true);
                setUserDetails(parsedUserDetails);
                console.log(
                  "Session restored after token refresh:",
                  parsedUserDetails
                );
              } else {
                console.log("Token refresh failed, clearing session");
                await handleLogout();
              }
            } else {
              // Token is still valid, no need to refresh
              console.log("Token is still valid, restoring session");
              setIsAuthenticated(true);
              setUserDetails(parsedUserDetails);
              console.log(
                "Session restored with valid token:",
                parsedUserDetails
              );
            }
          } catch (error) {
            console.log("Error checking token expiration:", error);
            // If we can't decode the token, try to refresh it
            const isValid = await handleRefreshTokens();
            if (isValid) {
              setIsAuthenticated(true);
              setUserDetails(parsedUserDetails);
              console.log(
                "Session restored after token refresh:",
                parsedUserDetails
              );
            } else {
              console.log("Token validation failed, clearing session");
              await handleLogout();
            }
          }
        } else {
          console.log("No valid session found.");
        }
      } catch (error) {
        console.error("Error initializing session:", error);
        await handleLogout();
      }
    };

    initializeSession();
  }, []);

  const saveCredential = async (
    schoolId: string,
    email: string | undefined,
    uniqueId: string | undefined,
    name: string,
    password: string,
    source: string,
    authId: string
  ) => {
    try {
      const newCredential: SavedCredential = {
        schoolId,
        email,
        uniqueId,
        name,
        password,
        lastLogin: new Date().toISOString(),
        source,
        authId,
      };

      // Use uniqueId for comparison if available, otherwise use email
      const identifier = uniqueId || email;
      const updatedCredentials = [
        newCredential,
        ...savedCredentials.filter((cred: any) => {
          const credIdentifier = cred.uniqueId || cred.email;
          return credIdentifier !== identifier;
        }),
      ].slice(0, 5); // Keep only last 5 credentials

      setSavedCredentials(updatedCredentials);
      await SecureStore.setItemAsync(
        "savedCredentials",
        JSON.stringify(updatedCredentials)
      );
    } catch (error) {
      console.error("Error saving credential:", error);
    }
  };

  const removeSavedCredential = async (identifier: string) => {
    try {
      const updatedCredentials = savedCredentials.filter((cred) => {
        const credIdentifier = cred.uniqueId || cred.email;
        return credIdentifier !== identifier;
      });
      setSavedCredentials(updatedCredentials);
      await SecureStore.setItemAsync(
        "savedCredentials",
        JSON.stringify(updatedCredentials)
      );
    } catch (error) {
      console.error("Error removing credential:", error);
    }
  };

  // handle login
  const handleLogin = async (
    input: LoginInput
  ): Promise<UserDetails | null> => {
    try {
      console.log("Starting login process...");

      // Clear any existing tokens before login to ensure clean state
      await clearTokens();
      await SecureStore.deleteItemAsync("userDetails");

      const { data } = await login({
        variables: {
          input,
        },
      });
      console.log("data.login", data);

      if (data?.login) {
        console.log("Login successful, saving tokens and user details...");

        await saveTokens(data.login.access_token, data.login.refresh_token);
        await SecureStore.setItemAsync(
          "userDetails",
          JSON.stringify(data.login.user)
        );

        // Set authentication state
        setIsAuthenticated(true);
        setUserDetails(data.login.user);

        console.log("User details set:", data.login.user);

        // Save the credential with password, user's role as source, and authId
        await saveCredential(
          data.login.user.schoolId,
          input.email,
          input.uniqueId,
          data.login.user.name,
          input.password,
          data.login.user.role,
          data.login.user.id
        );

        return data.login.user;
      }

      return null;
    } catch (error: any) {
      console.error("Login error:", error);
      // Clear any existing tokens on login error
      await clearTokens();
      await SecureStore.deleteItemAsync("userDetails");
      setIsAuthenticated(false);
      setUserDetails(null);
      throw error;
    }
  };

  // handle register
  const handleRegister = async (
    email: string,
    password: string,
    name: string
  ): Promise<UserDetails | null> => {
    try {
      const { data } = await register({
        variables: {
          input: { email, password, name },
        },
      });

      if (data?.register) {
        await saveTokens(
          data.register.access_token,
          data.register.refresh_token
        ); // Assuming it's `access_token`
        await SecureStore.setItemAsync(
          "userDetails",
          JSON.stringify(data.register.user)
        );
        setIsAuthenticated(true);
        setUserDetails(data.register.user);
        return data.register.user;
      }

      return null;
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // handle logout
  const handleLogout = async () => {
    try {
      console.log("Starting logout process...");

      // Set logout state to prevent refresh attempts
      setLogoutState(true);

      // Clear tokens first
      await clearTokens();
      await SecureStore.deleteItemAsync("userDetails");

      // Clear Apollo cache and reset store with proper error handling
      try {
        await forceClearApolloCache();
        console.log("Apollo cache cleared successfully");
      } catch (cacheError) {
        console.error("Error clearing Apollo cache:", cacheError);
        // Continue with logout even if cache clearing fails
      }

      // Update state
      setIsAuthenticated(false);
      setUserDetails(null);

      console.log("Logged out successfully, redirecting to login...");
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      // Even if there's an error, try to clear the state
      setIsAuthenticated(false);
      setUserDetails(null);
    } finally {
      // Reset logout state
      setLogoutState(false);
    }
  };

  // handle refresh tokens
  const handleRefreshTokens = async (): Promise<boolean> => {
    try {
      console.log("Manual token refresh initiated from AuthContext");

      // Check if we have a refresh token before attempting refresh
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (!refreshToken) {
        console.log("No refresh token found, cannot refresh");
        await handleLogout();
        return false;
      }

      // Check if refresh token is expired
      try {
        const payload = JSON.parse(atob(refreshToken.split(".")[1]));
        const expiration = new Date(payload.exp * 1000);
        const now = new Date();
        if (expiration < now) {
          console.log("Refresh token is expired");
          await handleLogout();
          return false;
        }
      } catch (error) {
        console.log("Could not decode refresh token:", error);
        await handleLogout();
        return false;
      }

      const success = await manualRefreshToken();
      if (success) {
        console.log("Manual token refresh successful");
        return true;
      } else {
        console.log("Manual token refresh failed");
        await handleLogout();
        return false;
      }
    } catch (error) {
      console.error("Manual token refresh failed:", error);
      await handleLogout();
      return false;
    }
  };

  // Check if token needs refresh
  const checkAndRefreshToken = async (): Promise<boolean> => {
    try {
      const accessToken = await SecureStore.getItemAsync("token");
      if (!accessToken) {
        console.log("No access token found");
        return false;
      }

      // Check if token is expired
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const expiration = new Date(payload.exp * 1000);
        const now = new Date();

        // Refresh token if it expires within the next 5 minutes
        const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

        if (expiration < fiveMinutesFromNow) {
          console.log("Token expires soon, refreshing...");
          return await handleRefreshTokens();
        }

        return true;
      } catch (error) {
        console.log("Could not decode access token:", error);
        return false;
      }
    } catch (error) {
      console.error("Error checking token:", error);
      return false;
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    userDetails,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshTokens: handleRefreshTokens,
    checkAndRefreshToken,
    loginLoading,
    registerLoading,
    loginError,
    registerError,
    savedCredentials,
    removeSavedCredential,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
