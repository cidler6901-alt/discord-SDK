// web-sdk/discord-sck.js
export class DiscordSCK {
  constructor({ clientId, api }) {
    this.clientId = clientId;
    this.api = api;
  }

  login() {
    const REDIRECT_URI = encodeURIComponent(`${this.api}/link-oauth`);
    const SCOPE = "identify";
    const RESPONSE_TYPE = "code";

    const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${this.clientId}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

    const popup = window.open(oauthUrl, "_blank", "width=500,height=700");
    if (!popup) alert("Please allow popups to login with Discord");
  }

  async handleRedirect() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) return null;

    const res = await fetch(`${this.api}/link-oauth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    if (!res.ok) throw new Error("Failed to link Discord account");
    return await res.json();
  }
}
