import Constants from "expo-constants";

const ENV = Constants.expoConfig?.extra?.env || "development";

let graphqlApiUrlConfig = "";
let restApiUrlConfig = "";
if (ENV === "development") {
  graphqlApiUrlConfig = "http://192.168.1.72:5000/graphql";
  restApiUrlConfig = "http://192.168.1.72:5000";
} else {
  graphqlApiUrlConfig =
    Constants.expoConfig?.extra?.apiUrl ||
    "https://server567.pampaseducation.com.np/graphql";
  restApiUrlConfig =
    Constants.expoConfig?.extra?.restApiUrl ||
    "https://server567.pampaseducation.com.np";
}

// API URLs based on environment
const getApiUrls = () => {
  switch (ENV) {
    case "production":
      return {
        apiUrl: "https://server567.pampaseducation.com.np/graphql",
        restApiUrl: "https://server567.pampaseducation.com.np",
      };
    case "staging":
      return {
        apiUrl: "https://server567.pampaseducation.com.np/graphql",
        restApiUrl: "https://server567.pampaseducation.com.np",
      };
    default: // development
      return {
        apiUrl: graphqlApiUrlConfig,
        restApiUrl: restApiUrlConfig,
      };
  }
};

const { apiUrl, restApiUrl } = getApiUrls();

// Export API URLs
export const API_URL = restApiUrl;
export const GRAPHQL_URL = apiUrl;

// Export environment
export const IS_DEVELOPMENT = ENV === "development";
export const IS_PRODUCTION = ENV === "production";
export const IS_STAGING = ENV === "staging";
