export const githubConfig = {
  clientId: process.env.GITHUB_CLIENT_ID || "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  redirectUri:
    process.env.GITHUB_REDIRECT_URI ||
    "http://localhost:3000/api/auth/github/callback",
  scope: "read:user user:email",
};

export async function getGithubAccessToken(code: string): Promise<string> {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: githubConfig.clientId,
      client_secret: githubConfig.clientSecret,
      code,
      redirect_uri: githubConfig.redirectUri,
    }),
  });

  const data = await response.json();
  return data.access_token;
}

export async function getGithubUserData(accessToken: string) {
  const [userResponse, emailsResponse] = await Promise.all([
    fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }),
    fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }),
  ]);

  const userData = await userResponse.json();
  const emails = await emailsResponse.json();

  interface GithubEmail {
    email: string;
    primary: boolean;
    verified: boolean;
  }

  // Get primary email
  const primaryEmail =
    emails.find((email: GithubEmail) => email.primary)?.email ||
    emails[0]?.email;

  return {
    githubId: userData.id.toString(),
    githubUsername: userData.login,
    email: primaryEmail,
    fullname: userData.name || userData.login,
    avatar: userData.avatar_url,
    bio: userData.bio,
    website: userData.blog,
    location: userData.location,
  };
}
