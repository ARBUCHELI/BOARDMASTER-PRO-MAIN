// Debug script to test project creation
// Run this in your browser console to test the Supabase connection

console.log("🔍 Testing Supabase connection and project creation...");

// Test 1: Check if Supabase client is available
if (typeof supabase !== 'undefined') {
  console.log("✅ Supabase client is available");
} else {
  console.log("❌ Supabase client is not available");
}

// Test 2: Check current user
supabase.auth.getUser().then(({ data: { user }, error }) => {
  if (user) {
    console.log("✅ User is authenticated:", user.email);
    console.log("User ID:", user.id);
  } else {
    console.log("❌ User is not authenticated:", error);
  }
});

// Test 3: Check if profiles table is accessible
supabase.from("profiles").select("id").limit(1).then(({ data, error }) => {
  if (error) {
    console.log("❌ Profiles table error:", error.message);
  } else {
    console.log("✅ Profiles table is accessible");
  }
});

// Test 4: Check if projects table is accessible
supabase.from("projects").select("id").limit(1).then(({ data, error }) => {
  if (error) {
    console.log("❌ Projects table error:", error.message);
  } else {
    console.log("✅ Projects table is accessible");
  }
});

// Test 5: Try to create a test project
const testProject = {
  name: "Test Project " + Date.now(),
  description: "Debug test project",
  owner_id: "test-user-id"
};

supabase.from("projects").insert([testProject]).then(({ data, error }) => {
  if (error) {
    console.log("❌ Project creation test failed:", error.message);
    console.log("Error details:", error);
  } else {
    console.log("✅ Project creation test succeeded:", data);
  }
});

console.log("🔍 Debug tests completed. Check the results above.");
