export const fetcher = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
  
      return response.json();
    } catch (err) {
      console.error(`Fetcher Error: ${err.message}`);
      throw err;
    }
  };
  
  // Example: Fetch data with authentication
  export const fetchWithAuth = async (url, token, options = {}) => {
    return fetcher(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  };
  