// web-sdk/discord-sck.js
export class DiscordSCK {
  constructor({ clientId, api }) {
    this.clientId = clientId;
    this.api = api; // e.g., "https://discord-sdk.onrender.com"
  }

  /**
   * Login with Discord
   */
  login() {
    const REDIRECT_URI = encodeURIComponent(`${this.api}/link-oauth`);
    const SCOPE = "identify";
    const RESPONSE_TYPE = "code";

    const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${this.clientId}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

    // Open Discord OAuth2 page in new tab
    window.open(oauthUrl, "_blank");
  }

  /**
   * Check for code returned from bot
   * Call this on page load if you expect Discord to redirect back
   */
  async handleRedirect() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) return null;

    // Send code to bot API
    const res = await fetch(`${this.api}/link-oauth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    if (!res.ok) throw new Error("Failed to link Discord account");
    const data = await res.json();

    return data;
  }
}
