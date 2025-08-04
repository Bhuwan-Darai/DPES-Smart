// Simple test to check if backend is accessible
const https = require("https");
const http = require("http");

const GRAPHQL_URL = "http://localhost:5000/graphql";

async function testBackend() {
  console.log("=== Testing Backend Accessibility ===\n");

  try {
    // Test 1: Simple HTTP GET request
    console.log("1. Testing basic HTTP connectivity...");
    const response = await new Promise((resolve, reject) => {
      const req = http.request(GRAPHQL_URL, { method: "GET" }, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve({ status: res.statusCode, data }));
      });
      req.on("error", reject);
      req.setTimeout(5000, () => reject(new Error("Timeout")));
      req.end();
    });

    console.log(`✅ Backend responded with status: ${response.status}`);
    console.log(`Response: ${response.data.substring(0, 200)}...`);
  } catch (error) {
    console.log(`❌ Backend test failed: ${error.message}`);

    if (error.code === "ECONNREFUSED") {
      console.log("\n🔧 Troubleshooting:");
      console.log("1. Make sure your backend server is running on port 5000");
      console.log(
        "2. Check if the server is accessible at http://localhost:5000"
      );
      console.log(
        "3. Verify the GraphQL endpoint is available at http://localhost:5000/graphql"
      );
    }

    return;
  }

  // Test 2: GraphQL introspection query
  console.log("\n2. Testing GraphQL endpoint...");
  try {
    const graphqlQuery = JSON.stringify({
      query: "query { __typename }",
    });

    const response = await new Promise((resolve, reject) => {
      const req = http.request(
        GRAPHQL_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(graphqlQuery),
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => resolve({ status: res.statusCode, data }));
        }
      );
      req.on("error", reject);
      req.setTimeout(5000, () => reject(new Error("Timeout")));
      req.write(graphqlQuery);
      req.end();
    });

    console.log(`✅ GraphQL responded with status: ${response.status}`);
    console.log(`Response: ${response.data}`);
  } catch (error) {
    console.log(`❌ GraphQL test failed: ${error.message}`);
  }
}

testBackend()
  .then(() => {
    console.log("\n=== Backend Test Completed ===");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });
