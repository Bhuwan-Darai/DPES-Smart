import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { Picker } from "@react-native-picker/picker";
import { getDeviceId } from "@/lib/utils/device";
import SplashScreen from "@/components/SplashScreen";

export default function LoginScreen() {
  const router = useRouter();
  const {
    login,
    loginLoading,
    loginError,
    savedCredentials,
    removeSavedCredential,
  } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    uniqueId: "",
    password: "",
    source: "Student",
  });
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (savedCredentials.length > 0) {
      setShowLoginForm(false);
    } else {
      setShowLoginForm(true);
    }
  }, [savedCredentials]);

  const [error, setError] = useState("");

  const handleLogin = async () => {
    // For admin users, email is required. For others, uniqueId is required
    const isAdmin = formData.source === "Admin";
    const hasRequiredField = isAdmin ? formData.email : formData.uniqueId;

    if (!hasRequiredField || !formData.password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    try {
      // get the deivceId from the device or generate a new one
      const deviceInfo = await getDeviceId();
      console.log("deviceId", deviceInfo);

      const loginData: any = {
        password: formData.password,
        source: formData.source,
        deviceId: deviceInfo.deviceId,
        ip: deviceInfo.ip,
        userAgent: deviceInfo.userAgent,
        os: deviceInfo.os,
        deviceType: deviceInfo.deviceType,
      };

      // Add email for admin, uniqueId for others
      if (formData.source === "Admin") {
        loginData.email = formData.email;
      } else {
        loginData.uniqueId = formData.uniqueId;
      }

      const user = await login(loginData);
      console.log("user when login", user);

      if (!user) {
        Alert.alert("Error", "Login failed. Please check your credentials.");
        return;
      }

      // switch the tabs based on the user role
      const role = user?.role;
      console.log("role when login", role);
      switch (role) {
        case "Student":
          router.replace("/(tabs)");
          break;
        case "Teacher":
          router.replace("/(TeacherTabs)");
          break;
        case "Staff":
          router.replace("/(StaffTabs)");
          break;
        case "Parents":
          router.replace("/(ParentTabs)");
          break;
        case "Admin":
          router.replace("/(adminTabs)");
          break;
        case "Principal":
          router.replace("/(PrincipalTabs)");
          break;
        default:
          router.replace("/(tabs)");
      }
    } catch (error) {
      Alert.alert("Error", "Login failed. Please check your credentials.");
    }
  };

  const handleContinue = async (cred: any) => {
    try {
      const loginData: any = {
        password: cred.password,
        source: cred.source,
      };

      // Add email for admin, uniqueId for others
      if (cred.source === "Admin") {
        loginData.email = cred.email;
      } else {
        loginData.uniqueId = cred.uniqueId;
      }

      const user = await login(loginData);

      if (!user) {
        Alert.alert("Error", "Login failed. Please check your credentials.");
        return;
      }

      console.log("user when login", user);
      // switch the tabs based on the user role
      const role = user?.role;
      console.log("role when login", role);
      switch (role) {
        case "Student":
          router.replace("/(tabs)");
          break;
        case "Teacher":
          router.replace("/(TeacherTabs)");
          break;
        case "Staff":
          router.replace("/(StaffTabs)");
          break;
        case "Parents":
          router.replace("/(ParentTabs)");
          break;
        case "Admin":
          router.replace("/(adminTabs)");
          break;
        case "Principal":
          router.replace("/(PrincipalTabs)");
          break;
        default:
          router.replace("/(tabs)");
          break;
      }
    } catch (error) {
      Alert.alert("Error", "Login failed. Please check your credentials.");
    }
  };

  // Facebook-style card for saved credential
  const renderSavedCredentialCard = () => {
    if (savedCredentials.length === 0) return null;

    return (
      <View style={styles.savedCredentialsContainer}>
        {savedCredentials.map((cred, index) => (
          <View key={index} style={styles.savedCardContainer}>
            <View style={styles.savedCardContent}>
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person-circle-outline" size={50} color="#bbb" />
              </View>
              <View style={styles.credentialInfo}>
                <Text style={styles.savedCardName}>{cred.name}</Text>
                <Text style={styles.savedCardEmail}>
                  {cred.uniqueId || cred.email}
                </Text>
                <TouchableOpacity
                  style={styles.savedCardContinueBtn}
                  onPress={() => handleContinue(cred)}
                >
                  <Text style={styles.savedCardContinueText}>Continue</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() =>
                  removeSavedCredential(
                    cred.uniqueId || cred.email || "unknown"
                  )
                }
              >
                <Ionicons name="close-circle" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addNewProfileButton}
          onPress={() => setShowLoginForm(true)}
        >
          <Text style={styles.addNewProfileText}>Use another profile</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        {!showLoginForm && renderSavedCredentialCard()}
        {/* {!showLoginForm && <SplashScreen />} */}
        {showLoginForm && (
          <>
            <View style={styles.header}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <Picker
                  selectedValue={formData.source}
                  onValueChange={(itemValue) =>
                    setFormData({ ...formData, source: itemValue })
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Student" value="Student" />
                  {/* <Picker.Item label="Admin" value="Admin" /> */}
                  <Picker.Item label="Teacher" value="Teacher" />
                  {/* <Picker.Item label="Staff" value="Staff" /> */}
                  <Picker.Item label="Parents" value="Parents" />
                  <Picker.Item label="Principal" value="Principal" />
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name={
                    formData.source === "Admin"
                      ? "mail-outline"
                      : "id-card-outline"
                  }
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={
                    formData.source === "Admin" ? "Email" : "Unique ID"
                  }
                  value={
                    formData.source === "Admin"
                      ? formData.email
                      : formData.uniqueId
                  }
                  onChangeText={(text) =>
                    formData.source === "Admin"
                      ? setFormData({ ...formData, email: text })
                      : setFormData({ ...formData, uniqueId: text })
                  }
                  keyboardType={
                    formData.source === "Admin" ? "email-address" : "default"
                  }
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={formData.password}
                  onChangeText={(text) =>
                    setFormData({ ...formData, password: text })
                  }
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.showPasswordButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  loginLoading && styles.buttonDisabled,
                ]}
                onPress={handleLogin}
                disabled={loginLoading}
              >
                <Text style={styles.loginButtonText}>
                  {loginLoading ? "Signing in..." : "Sign In"}
                </Text>
              </TouchableOpacity>
              {/* {loginError && (
                <ErrorScreen />
              )} */}
              {/* <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/auth/register")}>
                  <Text style={styles.registerLink}>Sign Up</Text>
                </TouchableOpacity>
              </View> */}
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    position: "relative",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
    fontSize: 14,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4285F4",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  registerLink: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  savedCredentialsContainer: {
    padding: 20,
  },
  savedCardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  savedCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    position: "relative",
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  credentialInfo: {
    flex: 1,
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
  },
  savedCardName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  savedCardEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  savedCardContinueBtn: {
    backgroundColor: "#1877F2",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  savedCardContinueText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  addNewProfileButton: {
    marginTop: 20,
    padding: 15,
    alignItems: "center",
  },
  addNewProfileText: {
    color: "#1877F2",
    fontSize: 16,
    fontWeight: "600",
  },
  picker: {
    flex: 1,
    height: 50,
  },
  showPasswordButton: {
    padding: 5,
  },
});
