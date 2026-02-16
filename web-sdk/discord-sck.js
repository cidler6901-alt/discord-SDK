// web-sdk/discord-sck.js

export class DiscordSCK {
  constructor({ clientId, api }) {
    this.clientId = clientId;
    this.api = api; // e.g., https://discord-sdk.onrender.com
  }

  async login() {
    const REDIRECT_URI = `${window.location.origin}/redirect.html`; // temporary redirect page
    const SCOPE = "identify";
    const RESPONSE_TYPE = "code";

    const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

    const popup = window.open(oauthUrl, "Discord Login", "width=500,height=700");

    if (!popup) return alert("Please allow popups to login with Discord");

    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
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

            try {
              // Send code to your API
              const res = await fetch(`${this.api}/link-oauth`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code })
              });

              if (!res.ok) throw new Error("Failed to fetch user from API");

              const user = await res.json();
              resolve(user);
            } catch (err) {
              reject(err);
            }
          }
        } catch (e) {
          // Cross-origin errors are expected until Discord redirects
        }
      }, 500);
    });
  }
}
