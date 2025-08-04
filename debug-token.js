// Debug script to check token status
// Run this with: node debug-tokens.js

const {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} = require("@apollo/client");
const { gql } = require("@apollo/client");

const GRAPHQL_URL = "http://localhost:5000/graphql"; // Update with your backend URL

const REFRESH_TOKENS_MUTATION = gql`
  mutation RefreshTokens($refreshToken: String!) {
    refreshTokens(refreshToken: $refreshToken) {
      access_token
      refresh_token
    }
  }
`;

const GET_CLASS_ROUTINE_QUERY = gql`
  query GetClassRoutine {
    getClassRoutine {
      id
      title
    }
  }
`;

async function debugTokens() {
  console.log("=== Token Debug Script ===\n");

  // Create Apollo client
  const client = new ApolloClient({
    link: createHttpLink({
      uri: GRAPHQL_URL,
      credentials: "include",
    }),
    cache: new InMemoryCache(),
  });

  try {
    // Step 1: Try to make a request without any token
    console.log("1. Testing request without token...");
    try {
      const result = await client.query({
        query: GET_CLASS_ROUTINE_QUERY,
      });
      console.log(
        "✅ Request succeeded without token (unexpected):",
        result.data
      );
    } catch (error) {
      console.log("❌ Request failed as expected:", error.message);
      if (error.graphQLErrors) {
        console.log(
          "GraphQL Errors:",
          error.graphQLErrors.map((e) => e.message)
        );
      }
    }

    // Step 2: Test refresh token mutation directly
    console.log("\n2. Testing refresh token mutation...");
    try {
      // You'll need to provide a valid refresh token here
      const refreshToken = "YOUR_REFRESH_TOKEN_HERE"; // Replace with actual token

      if (refreshToken === "YOUR_REFRESH_TOKEN_HERE") {
        console.log(
          "⚠️  Please replace the refresh token in the script to test"
        );
        return;
      }

      const refreshResult = await client.mutate({
        mutation: REFRESH_TOKENS_MUTATION,
        variables: { refreshToken },
      });

      console.log("✅ Refresh token successful:", refreshResult.data);

      // Step 3: Try the original request again with new token
      console.log("\n3. Testing request with new token...");
      const newResult = await client.query({
        query: GET_CLASS_ROUTINE_QUERY,
      });
      console.log("✅ Request with new token successful:", newResult.data);
    } catch (error) {
      console.log("❌ Refresh token failed:", error.message);
      if (error.graphQLErrors) {
        console.log(
          "GraphQL Errors:",
          error.graphQLErrors.map((e) => e.message)
        );
      }
      if (error.networkError) {
        console.log("Network Error:", error.networkError);
      }
    }
  } catch (error) {
    console.error("❌ Debug script failed:", error.message);
  }
}

// Run the debug script
debugTokens()
  .then(() => {
    console.log("\nDebug script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Debug script failed:", error);
    process.exit(1);
  });
