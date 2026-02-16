export class DiscordSCK {
  constructor({ clientId, api }) {
    this.clientId = clientId;
    this.api = api;
  }

  async login() {
    const REDIRECT_URI = encodeURIComponent("https://cidler6901-alt.github.io/discord-SDK/web-sdk/");
    const SCOPE = "identify";
    const RESPONSE_TYPE = "code";

    const url = `https://discord.com/api/oauth2/authorize?client_id=${this.clientId}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

    const popup = window.open(url, "Discord Login", "width=500,height=700");
    if (!popup) return alert("Enable popups for login!");

    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          if (!popup || popup.closed) {
            clearInterval(interval);
            reject("Popup closed");
            return;
          }

          const popupUrl = popup.location.href;
          if (popupUrl.includes("?code=")) {
            const code = new URL(popupUrl).searchParams.get("code");
            popup.close();
            clearInterval(interval);

            // Send code to API
            const res = await fetch(`${this.api}/link-oauth`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code }),
            });

            const user = await res.json();
            resolve(user);
          }
        } catch (err) {
          // Cross-origin errors while waiting for Discord redirect
        }
      }, 500);
    });
  }
}
