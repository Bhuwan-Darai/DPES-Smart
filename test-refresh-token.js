// Test script to verify refresh token mechanism
// Run this with: node test-refresh-token.js

const {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} = require("@apollo/client");
const { gql } = require("@apollo/client");

const GRAPHQL_URL = "http://localhost:5000/graphql"; // Update with your backend URL

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        name
        role
        schoolId
      }
      access_token
      refresh_token
    }
  }
`;

const REFRESH_TOKENS_MUTATION = gql`
  mutation RefreshTokens($refreshToken: String!) {
    refreshTokens(refreshToken: $refreshToken) {
      access_token
      refresh_token
    }
  }
`;

async function testRefreshToken() {
  console.log("Testing refresh token mechanism...\n");

  // Create Apollo client
  const client = new ApolloClient({
    link: createHttpLink({
      uri: GRAPHQL_URL,
      credentials: "include",
    }),
    cache: new InMemoryCache(),
  });

  try {
    // Step 1: Login
    console.log("1. Attempting login...");
    const loginResult = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: {
        input: {
          uniqueId: "STD-2080-81-8236", // Replace with valid test credentials
          password: "9869229932",
          source: "Student",
          deviceId: "test-device",
          ip: "127.0.0.1",
          userAgent: "Test User Agent",
          os: "Test OS",
          deviceType: "mobile",
        },
      },
    });

    if (loginResult.data?.login) {
      console.log("✅ Login successful");
      console.log("User:", loginResult.data.login.user.name);
      console.log("Role:", loginResult.data.login.user.role);

      const { access_token, refresh_token } = loginResult.data.login;
      console.log("Access token length:", access_token?.length || 0);
      console.log("Refresh token length:", refresh_token?.length || 0);

      // Step 2: Test refresh token
      console.log("\n2. Testing refresh token...");
      const refreshResult = await client.mutate({
        mutation: REFRESH_TOKENS_MUTATION,
        variables: {
          refreshToken: refresh_token,
        },
      });

      if (refreshResult.data?.refreshTokens) {
        console.log("✅ Refresh token successful");
        const { access_token: newAccessToken, refresh_token: newRefreshToken } =
          refreshResult.data.refreshTokens;
        console.log("New access token length:", newAccessToken?.length || 0);
        console.log("New refresh token length:", newRefreshToken?.length || 0);

        // Verify tokens are different
        if (access_token !== newAccessToken) {
          console.log("✅ Access tokens are different (as expected)");
        } else {
          console.log("❌ Access tokens are the same (unexpected)");
        }
      } else {
        console.log("❌ Refresh token failed");
        console.log("Error:", refreshResult.errors);
      }
    } else {
      console.log("❌ Login failed");
      console.log("Error:", loginResult.errors);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
    if (error.graphQLErrors) {
      console.error("GraphQL Errors:", error.graphQLErrors);
    }
    if (error.networkError) {
      console.error("Network Error:", error.networkError);
    }
  }
}

// Run the test
testRefreshToken()
  .then(() => {
    console.log("\nTest completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });
