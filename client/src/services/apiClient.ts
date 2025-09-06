// const API_URL = import.meta.env.VITE_BASE_URL;
//
const API_URL = "http://localhost:8000/";

const getAccessToken = () => localStorage.getItem("access");
const getRefreshToken = () => localStorage.getItem("refresh");

const getDefaultHeaders = () => {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

const refreshToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token found");

  const res = await fetch(`${API_URL}auth/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    throw new Error("Unable to refresh token");
  }

  const data = await res.json();
  localStorage.setItem("access", data.access);
  return data.access;
};

// MAIN API
const fetchAPI = async (
  endpoint: string,
  method: string = "GET",
  body?: any,
  isFormData = false,
  retry: boolean = true,
): Promise<any> => {
  const headers = isFormData
    ? {
        ...(getAccessToken()
          ? { Authorization: `Bearer ${getAccessToken()}` }
          : {}),
      }
    : getDefaultHeaders();

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      credentials: "include",
      ...(body && (isFormData ? { body } : { body: JSON.stringify(body) })),
    });

    if (res.status === 401 && retry) {
      try {
        await refreshToken();
        return fetchAPI(endpoint, method, body, isFormData, false); // retry once
      } catch (refreshErr) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        throw new Error("Session expired. Please log in again.");
      }
    }

    if (!res.ok) {
      const error = await res.text();
      //   toast.error(`Error ${res.status}: ${error}`);
      throw new Error(`Error ${res.status}: ${error}`);
    }

    return res.status !== 204 ? await res.json() : null;
  } catch (err: any) {
    // toast.error(err.message || "Something went wrong!");
    throw err;
  }
};

// LOGIN
export const login = async (data: { email: string; password: string }) => {
  const res = await fetchAPI("auth/login/", "POST", data);

  if (res.data.access && res.data.refresh) {
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
  } else {
    throw new Error("Login failed: invalid response");
  }

  return res;
};

// REGISTER
export const register = async ({
  username,
  email,
  password,
  role,
}: {
  username: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await fetchAPI("auth/register/", "POST", {
    username,
    email,
    password,
    role,
  });

  if (!res.ok) {
    const errorData = await res.json();
    return errorData;
  }

  return res;
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

export const getCurrentUser = () => fetchAPI("me/");
// export const getBlogCategory = (slug: string) => fetchAPI(`blog-categories/${slug}/`);
//

export const getArtist = (body: any) => 
  fetchAPI(`/api/artists/`, "POST",body);

export const updateProfile = (data: any) =>
  fetchAPI("/api/auth/update/", "PATCH", data);

// FACEBOOK LOGIN
export const loginWithFacebook = async () => {
  window.location.href = `${API_URL}auth/facebook/`;
};

// FACEBOOK CALLBACK HANDLER
export const handleFacebookCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (!code) throw new Error("No code found in Facebook callback URL");

  const res = await fetchAPI(`auth/facebook/callback/?code=${code}`, "GET");

  if (res.access && res.refresh) {
    localStorage.setItem("access", res.access);
    localStorage.setItem("refresh", res.refresh);
  } else {
    throw new Error("Facebook login failed");
  }

  return res;
}

// GOOGLE LOGIN

export const loginWithGoogle = () => {
  window.location.href = `${API_URL}auth/google`
}
export const handleGoogleCallback = async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");


  if (!code) throw new Error("Google auth code not found");

  const res = await fetchAPI("auth/google/callback", "POST", { code });

  if (res.access && res.refresh) {
    localStorage.setItem("access", res.access);
    localStorage.setItem("refresh", res.refresh);
  }

  return res;
};
