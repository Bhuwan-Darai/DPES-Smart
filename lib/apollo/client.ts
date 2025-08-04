import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  FetchResult,
  Observable,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { GRAPHQL_URL } from "../constants";
import * as SecureStore from "expo-secure-store";
import { REFRESH_TOKENS_MUTATION } from "../graphql/auth";

// Enables detailed Apollo messages in Expo dev mode
if (__DEV__) {
  loadDevMessages();
  loadErrorMessages();
}

// Save tokens securely
export const saveTokens = async (
  accessToken: string,
  refreshToken: string
): Promise<void> => {
  await SecureStore.setItemAsync("token", accessToken);
  await SecureStore.setItemAsync("refreshToken", refreshToken);
};

// Get tokens
export const getAccessToken = async (): Promise<string | null> =>
  await SecureStore.getItemAsync("token");

export const getRefreshToken = async (): Promise<string | null> =>
  await SecureStore.getItemAsync("refreshToken");

// clear tokens securely
export const clearTokens = async (): Promise<void> => {
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("refreshToken");
};

// Utility function to check token status
export const checkTokenStatus = async () => {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();
  const userDetails = await SecureStore.getItemAsync("userDetails");

  console.log("=== Token Status ===");
  console.log(
    "Access Token:",
    accessToken ? `${accessToken.substring(0, 20)}...` : "None"
  );
  console.log(
    "Refresh Token:",
    refreshToken ? `${refreshToken.substring(0, 20)}...` : "None"
  );
  console.log("User Details:", userDetails ? "Present" : "None");

  if (accessToken) {
    try {
      // Decode JWT to check expiration (without verification)
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const expiration = new Date(payload.exp * 1000);
      const now = new Date();
      console.log("Token expires at:", expiration);
      console.log("Current time:", now);
      console.log("Token expired:", expiration < now);
    } catch (error) {
      console.log("Could not decode token:", error);
    }
  }

  return { accessToken, refreshToken, userDetails };
};

// Utility function to handle authentication failure
export const handleAuthFailure = async () => {
  console.log(
    "Handling authentication failure - clearing tokens and redirecting to login"
  );
  await clearTokens();
  await SecureStore.deleteItemAsync("userDetails");

  // Clear Apollo cache with proper error handling
  try {
    await client.clearStore();
    await client.resetStore();
    console.log("Apollo cache cleared during auth failure");
  } catch (error) {
    console.error("Error clearing Apollo cache during auth failure:", error);
  }

  // Note: In a real app, you would redirect to login here
  // For now, we'll just log the action
  console.log("Authentication failed - user should be redirected to login");
};

// Function to force clear all Apollo cache and state
export const forceClearApolloCache = async () => {
  try {
    console.log("Force clearing Apollo cache...");

    // Stop all ongoing operations
    client.stop();

    // Clear cache
    await client.clearStore();
    await client.resetStore();

    console.log("Apollo cache force cleared successfully");
  } catch (error) {
    console.error("Error force clearing Apollo cache:", error);
  }
};

// Function to set logout state
export const setLogoutState = (loggingOut: boolean) => {
  isLoggingOut = loggingOut;
  console.log("Logout state set to:", loggingOut);

  if (loggingOut) {
    // Stop background refresh

    // Clear any pending refresh requests during logout
    pendingRequests.forEach((callback) => {
      callback(""); // Pass empty token to fail the requests
    });
    pendingRequests = [];
    isRefreshing = false;

    // Clear any ongoing operations
    client.stop();

    console.log(
      "Cleared pending refresh requests and stopped background refresh"
    );
  }
};

// Manual refresh function for testing
export const manualRefreshToken = async (): Promise<boolean> => {
  try {
    console.log("Manual token refresh initiated");
    await refreshTokens();
    console.log("Manual token refresh successful");
    return true;
  } catch (error) {
    console.error("Manual token refresh failed:", error);
    return false;
  }
};

console.log("Using API URL:", GRAPHQL_URL); // For debugging

const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
  credentials: "include",
});

// auth link to attach the tokens to the headers
const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token = await getAccessToken(); // Changed from getRefreshToken() to getAccessToken()

  //attach the userDetails with role as well
  const userDetails = await SecureStore.getItemAsync("userDetails");
  console.log("userDetails", userDetails);

  console.log("=== Auth Link ===");
  console.log("Operation:", _.operationName);
  console.log("Token available:", token);
  console.log("User details available:", userDetails ? "Yes" : "No");

  if (token) {
    console.log("Attaching token to request:", token.substring(0, 20) + "...");

    // Decode token to check expiration
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiration = new Date(payload.exp * 1000);
      const now = new Date();
      console.log("Token expires at:", expiration);
      console.log("Current time:", now);
      console.log("Token expired:", expiration < now);

      // Refresh token if it's expired OR if it expires within the next 2 minutes
      const twoMinutesFromNow = new Date(now.getTime() + 2 * 60 * 1000);
      const shouldRefresh = expiration < twoMinutesFromNow;

      if (shouldRefresh) {
        console.log(
          "Token is expired or expires soon, attempting to refresh..."
        );
        try {
          // Check if we have a refresh token
          const refreshToken = await getRefreshToken();
          if (refreshToken) {
            console.log(
              "Refresh token found, attempting to get new access token..."
            );
            const newToken = await refreshTokens();
            if (newToken) {
              console.log("Token refreshed successfully, using new token");
              token = newToken;
            } else {
              console.log("Token refresh failed, clearing tokens");
              await clearTokens();
              await SecureStore.deleteItemAsync("userDetails");
              token = null;
            }
          } else {
            console.log("No refresh token found, clearing tokens");
            await clearTokens();
            await SecureStore.deleteItemAsync("userDetails");
            token = null;
          }
        } catch (error) {
          console.log("Token refresh failed:", error);
          // Clear tokens on refresh failure
          await clearTokens();
          await SecureStore.deleteItemAsync("userDetails");
          token = null;
        }
      } else {
        console.log("Token is still valid, no refresh needed");
      }
    } catch (error) {
      console.log("Could not decode token:", error);
      // If we can't decode the token, clear it
      await clearTokens();
      await SecureStore.deleteItemAsync("userDetails");
      token = null;
    }
  } else {
    console.log("No token found for request");
  }

  // return the headers to the context so httpLink can read them
  const authHeaders = {
    ...headers,
    authorization: token ? `Bearer ${token}` : "",
    user: userDetails || "", // userDetails is already a string from AsyncStorage
  };

  console.log("Final headers:", {
    authorization: authHeaders.authorization ? "Present" : "Missing",
    user: authHeaders.user ? "Present" : "Missing",
  });
  console.log("=== Auth Link End ===");

  return {
    headers: authHeaders,
  };
});

// Track refresh in progress
let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];
let isLoggingOut = false;

// Function to request new tokens using direct GraphQL request
const refreshTokens = async (): Promise<string> => {
  if (isRefreshing) {
    console.log("Token refresh already in progress, waiting...");
    return new Promise((resolve) => {
      pendingRequests.push(resolve);
    });
  }

  // Don't refresh if we're logging out
  if (isLoggingOut) {
    console.log("Skipping token refresh during logout");
    throw new Error("Token refresh skipped during logout");
  }

  isRefreshing = true;
  pendingRequests = [];

  try {
    // Check current token status for debugging
    await checkTokenStatus();

    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      console.error("No refresh token found in storage");
      throw new Error("No refresh token");
    }

    // Check if refresh token is expired
    try {
      const payload = JSON.parse(atob(refreshToken.split(".")[1]));
      const expiration = new Date(payload.exp * 1000);
      const now = new Date();
      if (expiration < now) {
        console.error("Refresh token is expired");
        throw new Error("Refresh token expired");
      }
      console.log("Refresh token expires at:", expiration);
    } catch (error) {
      console.error("Could not decode refresh token:", error);
      throw new Error("Invalid refresh token");
    }

    console.log(
      "Attempting to refresh token with:",
      refreshToken.substring(0, 20) + "..."
    );

    // Create a temporary client for refresh token request
    const tempClient = new ApolloClient({
      link: createHttpLink({
        uri: GRAPHQL_URL,
        credentials: "include",
      }),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          errorPolicy: "all",
        },
        mutate: {
          errorPolicy: "all",
        },
      },
    });

    // Add retry mechanism for refresh token request
    let result: any;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        console.log(`Refresh token attempt ${retryCount + 1}/${maxRetries}`);
        result = await tempClient.mutate({
          mutation: REFRESH_TOKENS_MUTATION,
          variables: { refreshToken },
        });
        console.log("result from refresh token request", result);
        console.log("Refresh token request successful");
        break; // Success, exit retry loop
      } catch (error: any) {
        retryCount++;
        console.log(
          `Refresh token attempt ${retryCount} failed:`,
          error.message
        );

        if (retryCount >= maxRetries) {
          console.error("Max retries reached for refresh token");
          throw error; // Re-throw if max retries reached
        }

        // Wait before retrying (exponential backoff)
        const waitTime = 1000 * retryCount;
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    console.log("result from refresh token request", result);

    if (!result) {
      throw new Error("Failed to refresh token after all retries");
    }

    console.log("Refresh token result received");

    if (result.errors) {
      console.error("Refresh token GraphQL errors:", result.errors);
      throw new Error(result.errors[0].message);
    }

    if (!result.data?.refreshTokens) {
      console.error("No refresh token data in response");
      throw new Error("Invalid refresh token response");
    }

    const { access_token, refresh_token } = result.data.refreshTokens;

    if (!access_token || !refresh_token) {
      console.error("Missing tokens in refresh response");
      throw new Error("Invalid token response");
    }

    console.log("Saving new tokens...");
    await saveTokens(access_token, refresh_token);

    // Notify all waiting requests
    console.log(`Notifying ${pendingRequests.length} pending requests`);
    pendingRequests.forEach((callback) => callback(access_token));
    pendingRequests = [];

    console.log("Token refresh successful");
    return access_token; // Return the new access token
  } catch (error: any) {
    console.error("Refresh token error:", error);
    console.error("Error details:", {
      message: error?.message || "Unknown error",
      stack: error?.stack,
      graphQLErrors: error?.graphQLErrors,
      networkError: error?.networkError,
    });

    // Force logout on failure
    console.log("Clearing tokens due to refresh failure");
    await handleAuthFailure();
    throw error;
  } finally {
    isRefreshing = false;
  }
};

// Error link to handle 401/UNAUTHENTICATED
const errorLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((result: FetchResult) => {
    const context = operation.getContext();
    const response = context.response;

    // Check for UNAUTHENTICATED error
    for (const err of result.errors || []) {
      console.log(`GraphQL Error in ${operation.operationName}:`, err.message);

      // Only handle authentication errors, not other types of errors
      if (
        err.message.toLowerCase().includes("unauthenticated") ||
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.message.toLowerCase().includes("unauthorized")
      ) {
        // Don't attempt refresh if we're logging out
        if (isLoggingOut) {
          console.log(
            `Skipping refresh during logout for ${operation.operationName}`
          );
          return result;
        }

        // Don't attempt refresh for auth-related operations to avoid infinite loops
        if (
          operation.operationName === "Login" ||
          operation.operationName === "Register" ||
          operation.operationName === "RefreshTokens"
        ) {
          console.log(
            `Skipping refresh for auth operation: ${operation.operationName}`
          );
          return result;
        }

        console.log(
          `Auth error detected in ${operation.operationName}, will attempt token refresh`
        );
        // Mark this operation as needing retry
        operation.setContext({ authError: true });
      }
    }

    return result;
  });
}).concat(
  new ApolloLink((operation, forward) => {
    if (operation.getContext().authError) {
      // Skip retrying the refresh mutation itself
      if (operation.operationName === "RefreshTokens") {
        console.log("Skipping refresh for RefreshTokens operation");
        return forward(operation);
      }

      // Don't attempt refresh if we're logging out
      if (isLoggingOut) {
        console.log(
          `Skipping refresh during logout for ${operation.operationName}`
        );
        return forward(operation);
      }

      console.log(
        `Attempting to refresh token for operation: ${operation.operationName}`
      );

      return new Observable((observer: any) => {
        refreshTokens()
          .then((newToken) => {
            console.log(
              `Token refreshed successfully for ${operation.operationName}`
            );
            // Update operation context with new token
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${newToken}`,
              },
            });

            // Retry the original request
            const subscriber = {
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            };

            // Retry
            forward(operation).subscribe(subscriber);
          })
          .catch((error) => {
            console.error(
              `Token refresh failed for ${operation.operationName}:`,
              error
            );
            // If refresh fails, clear tokens and redirect to login
            handleAuthFailure();
            observer.error(error);
          });
      });
    }

    return forward(operation);
  })
);

export const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
  connectToDevTools: __DEV__,
});
