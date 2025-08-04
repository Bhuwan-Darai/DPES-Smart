// Test script to verify logout process
// Run this with: node test-logout.js

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

const GET_ASSIGNMENTS_QUERY = gql`
  query GetAssignmentsForStudent {
    getAssignmentsForStudent {
      id
      title
      description
    }
  }
`;

async function testLogout() {
  console.log("Testing logout process...\n");

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
          uniqueId: "STD-2080-81-8236",
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

      const { access_token, refresh_token } = loginResult.data.login;
      console.log("Access token length:", access_token?.length || 0);
      console.log("Refresh token length:", refresh_token?.length || 0);

      // Step 2: Make an authenticated request
      console.log("\n2. Making authenticated request...");
      try {
        const assignmentsResult = await client.query({
          query: GET_ASSIGNMENTS_QUERY,
        });
        console.log("✅ Authenticated request successful");
        console.log(
          "Assignments count:",
          assignmentsResult.data?.getAssignmentsForStudent?.length || 0
        );
      } catch (error) {
        console.log("❌ Authenticated request failed:", error.message);
      }

      // Step 3: Simulate logout by clearing tokens
      console.log("\n3. Simulating logout...");

      // Clear tokens (simulating logout)
      console.log("Clearing tokens...");
      // In a real app, this would be done by the logout function

      // Step 4: Try to make another request (should fail gracefully)
      console.log("\n4. Making request after logout...");
      try {
        const postLogoutResult = await client.query({
          query: GET_ASSIGNMENTS_QUERY,
        });
        console.log(
          "❌ Request should have failed but succeeded:",
          postLogoutResult.data
        );
      } catch (error) {
        console.log(
          "✅ Request failed as expected after logout:",
          error.message
        );
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
testLogout()
  .then(() => {
    console.log("\nTest completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });
