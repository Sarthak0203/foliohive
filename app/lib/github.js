import fetch from 'node-fetch';

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Add your token in `.env`

// Fetch data from GitHub API
export const fetchFromGitHub = async (endpoint, params = {}) => {
  const url = new URL(`${GITHUB_API_URL}/${endpoint}`);
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.statusText}`);
  }

  return response.json();
};

// Example: Fetch repositories for a user
export const getUserRepositories = async (username) => {
  return fetchFromGitHub(`users/${username}/repos`);
};
