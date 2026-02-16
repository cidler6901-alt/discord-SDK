<script>
async function handleOAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) return;

  try {
    // Send code to your API to exchange for token & user info
    const res = await fetch(
      "https://discord-sdk.onrender.com/link-oauth", // Replace with your API endpoint
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      }
    );

    const data = await res.json();
    console.log("Logged in user:", data);

    // Update page for logged-in user
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("user-info").textContent =
      `Hello, ${data.username}#${data.discriminator}`;

  } catch (err) {
    console.error("OAuth failed", err);
  }
}

// Run on page load
handleOAuthCallback();
</script>
