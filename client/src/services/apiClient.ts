const API_URL = "http://localhost:8000/api/";

// Token management
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

// Refresh JWT token
const refreshToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token found");

  const res = await fetch(`${API_URL}accounts/token/refresh/`, {
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

// Main API wrapper
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
      ...(body && (isFormData ? { body } : { body: JSON.stringify(body) })),
    });

    // Handle 401 Unauthorized (token expired)
    if (res.status === 401 && retry) {
      try {
        await refreshToken();
        return fetchAPI(endpoint, method, body, isFormData, false); // retry once
      } catch (refreshErr) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
        throw new Error("Session expired. Please log in again.");
      }
    }

    if (!res.ok) {
      if (res.status === 403) {
        throw new Error("You don't have permission to access this resource.");
      }
      const error = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `Error ${res.status}`);
    }

    return res.status !== 204 ? await res.json() : null;
  } catch (err: any) {
    console.error('API Error:', err);
    throw err;
  }
};

// ========== AUTHENTICATION ==========

// REGISTER - Updated for Django
export const register = async (data: {
  username: string;
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
}) => {
  try {
    const response = await fetchAPI("accounts/register/", "POST", data);
    
    // Django returns user data directly, not in a 'data' field
    if (response.user) {
      // Store tokens if they're returned
      if (response.access) {
        localStorage.setItem("access", response.access);
      }
      if (response.refresh) {
        localStorage.setItem("refresh", response.refresh);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// LOGIN - Updated for Django
export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await fetchAPI("accounts/login/", "POST", data);
    
    // Store tokens
    if (response.access) {
      localStorage.setItem("access", response.access);
      localStorage.setItem("refresh", response.refresh);
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  // Optional: Call backend logout endpoint if you have one
  // fetchAPI("accounts/logout/", "POST");
};

// GET CURRENT USER
export const getCurrentUser = () => fetchAPI("accounts/me/");

// UPDATE PROFILE
export const updateProfile = (data: any) =>
  fetchAPI("accounts/me/", "PATCH", data);

// ========== SOCIAL AUTH ==========

// FACEBOOK LOGIN (You'll need to implement this in Django)
export const loginWithFacebook = async () => {
  window.location.href = `${API_URL}accounts/facebook/login/`;
};

// FACEBOOK CALLBACK HANDLER
export const handleFacebookCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");

  if (!code) throw new Error("No code found in Facebook callback URL");

  const response = await fetchAPI(`accounts/facebook/callback/?code=${code}&state=${state}`, "GET");
  
  if (response.access) {
    localStorage.setItem("access", response.access);
    localStorage.setItem("refresh", response.refresh);
  }
  
  return response;
};

// GOOGLE LOGIN
export const loginWithGoogle = () => {
  window.location.href = `${API_URL}accounts/google/login/`;
};

// GOOGLE CALLBACK HANDLER
export const handleGoogleCallback = async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const state = params.get("state");

  if (!code) throw new Error("Google auth code not found");

  const response = await fetchAPI("accounts/google/callback/", "POST", { 
    code, 
    state 
  });

  if (response.access) {
    localStorage.setItem("access", response.access);
    localStorage.setItem("refresh", response.refresh);
  }

  return response;
};

// ========== PROFILE & DATA ==========

// ARTIST OPERATIONS
export const getArtist = (body: any) => 
  fetchAPI("profiles/artists/", "POST", body);

export const getArtists = () => 
  fetchAPI("profiles/artists/", "GET");

// JOB LISTINGS
export const getJobs = () => 
  fetchAPI("jobs/", "GET");

export const getJob = (id: string) => 
  fetchAPI(`jobs/${id}/`, "GET");

// INVESTOR OPERATIONS
export const getInvestors = () => 
  fetchAPI("profiles/investors/", "GET");

// JOB SEEKER OPERATIONS
export const getJobSeekers = () => 
  fetchAPI("profiles/job-seekers/", "GET");

// ========== UTILITY FUNCTIONS ==========

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAccessToken();
};

// Get auth headers for external API calls
export const getAuthHeaders = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Clear all auth data
export const clearAuth = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

// ========== REACT QUERY CONFIG ==========

// Optional: React Query configuration
export const queryConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
};

export const getJobSeekerProfile = () => 
  fetchAPI('job-seeker/profile/', 'GET');

export const updateJobSeekerProfile = (data: any) =>
  fetchAPI('job-seeker/profile/', 'PATCH', data);

export const uploadResume = (file: File) => {
  const formData = new FormData();
  formData.append('resume', file);
  return fetchAPI('job-seeker/profile/upload-resume/', 'POST', formData, true);
};

export const uploadAvatar = (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return fetchAPI('job-seeker/profile/upload-avatar/', 'POST', formData, true);
};

export const getExperiences = () => 
  fetchAPI('job-seeker/experiences/', 'GET');

export const addExperience = (data: any) =>
  fetchAPI('job-seeker/experiences/', 'POST', data);

export const updateExperience = (id: number, data: any) =>
  fetchAPI(`job-seeker/experiences/${id}/`, 'PUT', data);

export const deleteExperience = (id: number) =>
  fetchAPI(`job-seeker/experiences/${id}/`, 'DELETE');

export const getProjects = () => 
  fetchAPI('job-seeker/projects/', 'GET');

export const addProject = (data: any) =>
  fetchAPI('job-seeker/projects/', 'POST', data);

export const updateProject = (id: number, data: any) =>
  fetchAPI(`job-seeker/projects/${id}/`, 'PUT', data);

export const deleteProject = (id: number) =>
  fetchAPI(`job-seeker/projects/${id}/`, 'DELETE');

export const addSkills = (skills: string[]) =>
  fetchAPI('job-seeker/skills/', 'POST', { skills });

export const removeSkill = (id: number) =>
  fetchAPI(`job-seeker/skills/${id}/`, 'DELETE');

