export async function loginWithDiscord() {
  const CLIENT_ID = "1471857321696166072";
  const REDIRECT_URI = encodeURIComponent("https://cidler6901-alt.github.io/discord-SDK/web-sdk/redirect.html");
  const SCOPE = "identify";
  const RESPONSE_TYPE = "code";

  const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

  const popup = window.open(oauthUrl, "Discord Login", "width=500,height=700");
  if (!popup) return alert("Please allow popups to login with Discord");

  return new Promise((resolve, reject) => {
    const listener = async (event) => {
      if (event.data?.type === "discord-code") {
        window.removeEventListener("message", listener);
        popup.close();

        // Send code to bot API
        try {
          const res = await fetch("https://discord-sdk.onrender.com/link-oauth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: event.data.code })
          });
          const user = await res.json();
          resolve(user);
        } catch (err) {
          reject(err);
        }
      }
    };

    window.addEventListener("message", listener);
  });
}
