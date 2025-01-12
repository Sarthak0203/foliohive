// lib/oauthUtils.js

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Get OAuth provider authorization URL
export function getProviderAuthUrl(provider) {
  const baseUrls = {
    github: 'https://github.com/login/oauth/authorize',
    google: 'https://accounts.google.com/o/oauth2/v2/auth'
  };

  const configs = {
    github: {
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth?provider=github`, // Corrected redirect_uri
      scope: 'read:user user:email'
    },
    google: {
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth?provider=google`, // Corrected redirect_uri
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
    }
  };

  const config = configs[provider];
  if (!config) throw new Error('Invalid provider');

  const params = new URLSearchParams(config);
  return `${baseUrls[provider]}?${params.toString()}`;
}

// Handle GitHub OAuth callback
export async function handleGithubCallback(code) {
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Use form-urlencoded for GitHub
        Accept: 'application/json'
      },
      body: new URLSearchParams({ // Use URLSearchParams to encode body
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code
      })
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      throw new Error(tokenData.error_description);
    }

    // Get user data
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${tokenData.access_token}`
      }
    });

    const userData = await userResponse.json();
    
    // Get user email
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${tokenData.access_token}`
      }
    });

    const emails = await emailsResponse.json();
    const primaryEmail = emails.find(email => email.primary)?.email;

    return {
      success: true,
      data: {
        provider: 'github',
        providerId: userData.id.toString(),
        email: primaryEmail,
        name: userData.name || userData.login,
        avatar: userData.avatar_url
      }
    };
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return {
      success: false,
      error: 'GitHub authentication failed'
    };
  }
}

// Handle Google OAuth callback
export async function handleGoogleCallback(code) {
  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth?provider=google`,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      throw new Error(tokenData.error_description);
    }

    // Get user data
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });

    const userData = await userResponse.json();

    return {
      success: true,
      data: {
        provider: 'google',
        providerId: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.picture
      }
    };
  } catch (error) {
    console.error('Google OAuth error:', error);
    return {
      success: false,
      error: 'Google authentication failed'
    };
  }
}

// Main OAuth handler function
export async function handleOAuthCallback(provider, code) {
  try {
    switch (provider) {
      case 'github':
        return await handleGithubCallback(code);
      case 'google':
        return await handleGoogleCallback(code);
      default:
        return {
          success: false,
          error: 'Unsupported provider'
        };
    }
  } catch (error) {
    console.error('OAuth error:', error);
    return {
      success: false,
      error: 'Authentication failed'
    };
  }
}