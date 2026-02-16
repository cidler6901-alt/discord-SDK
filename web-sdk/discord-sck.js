// web-sdk/discord-sck.js

export class DiscordSCK {
  constructor({ clientId, api }) {
    this.clientId = clientId;
    this.api = api;
  }

  async login() {
    const REDIRECT_URI = encodeURIComponent(
      "https://cidler6901-alt.github.io/discord-SDK/web-sdk/"
    );
    const SCOPE = "identify";
    const RESPONSE_TYPE = "code";

    const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${this.clientId}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

    // Open popup
    const popup = window.open(oauthUrl, "Discord Login", "width=500,height=700");
    if (!popup) return alert("Please allow popups to login with Discord");

    return new Promise((resolve, reject) => {
      const messageHandler = async (event) => {
        // Only accept messages from your frontend page
        if (event.origin !== "https://cidler6901-alt.github.io") return;
        window.removeEventListener("message", messageHandler);

        const code = event.data?.code;
        if (!code) return reject("No code received");

        try {
          const res = await fetch(`${this.api}/link-oauth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
          });
          const user = await res.json();
          resolve(user);
        } catch (err) {
          reject(err);
        }
      };

      window.addEventListener("message", messageHandler);
    });
  }
}
