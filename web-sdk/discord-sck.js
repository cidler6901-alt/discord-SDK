// web-sdk/discord-sck.js

const BOT_API_URL = "https://discord-sdk.onrender.com"; // Your bot's Render URL

/**
 * Open Discord OAuth2 login popup and get user info
 */
export async function loginWithDiscord() {
  // 1️⃣ Open Discord OAuth2 window
  const CLIENT_ID = "1471857321696166072"; // replace with your Discord App client ID
  const REDIRECT_URI = encodeURIComponent(window.location.href); // current page
  const SCOPE = "identify";
  const RESPONSE_TYPE = "code";

  const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

  // Open in new window for login
  const popup = window.open(oauthUrl, "Discord Login", "width=500,height=700");

  if (!popup) return alert("Please allow popups to login with Discord");

  // 2️⃣ Wait for redirect with code
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(interval);
          reject("Login popup closed");
          return;
        }

        const url = popup.location.href;
        if (url.includes("?code=")) {
          const code = new URL(url).searchParams.get("code");
          popup.close();
          clearInterval(interval);

          // 3️⃣ Send code to bot API
          fetch(`${BOT_API_URL}/link-oauth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
          })
            .then(res => res.json())
            .then(user => resolve(user))
            .catch(err => reject(err));
        }
      } catch (e) {
        // Cross-origin until Discord redirects back to your page
      }
    }, 500);
  });
}

/**
 * Example usage:
 * 
 * import { loginWithDiscord } from "./discord-sck.js";
 * 
 * document.getElementById("discord-login-btn").addEventListener("click", async () => {
 *   try {
 *     const user = await loginWithDiscord();
 *     console.log("Logged in user:", user);
 *     alert(`Hello ${user.username}#${user.discriminator}`);
 *   } catch (err) {
 *     console.error(err);
 *     alert("Discord login failed");
 *   }
 * });
 */
