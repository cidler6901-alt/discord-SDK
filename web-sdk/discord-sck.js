class DiscordSCK {
  constructor(config){
    this.clientId = config.clientId;
    this.api = config.api;
  }

  login(){
    const redirect = encodeURIComponent(window.location.href);
    window.location.href =
      `https://discord.com/api/oauth2/authorize?client_id=${this.clientId}` +
      `&redirect_uri=${redirect}&response_type=code&scope=identify`;
  }

  async getProfile(discordId){
    const res = await fetch(`${this.api}/users/${discordId}`);
    return res.json();
  }
}

window.DiscordSCK = DiscordSCK;
