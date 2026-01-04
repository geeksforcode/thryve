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
    console.log(`🚀 API Request: ${method} ${API_URL}${endpoint}`);
    if (body && !isFormData) {
      console.log("📤 Request Body:", JSON.stringify(body, null, 2));
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      ...(body && (isFormData ? { body } : { body: JSON.stringify(body) })),
    });

    console.log(` API Response: ${res.status} ${res.statusText}`);

    if (res.status === 401 && retry) {
      try {
        console.log(" Token expired, attempting refresh...");
        await refreshToken();
        return fetchAPI(endpoint, method, body, isFormData, false);
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
      let errorData;
      try {
        errorData = await res.json();
        console.error(" API Error Details:", errorData);
      } catch {
        errorData = { detail: 'Unknown error' };
      }
      
      if (res.status === 400) {
        let errorMessage = 'Bad Request - Please check your input';
        
        if (typeof errorData === 'object') {
          const errorMessages = [];
          
          if (errorData.detail) {
            errorMessages.push(errorData.detail);
          }
          
          for (const [field, errors] of Object.entries(errorData)) {
            if (Array.isArray(errors)) {
              errorMessages.push(`${field}: ${errors.join(', ')}`);
            } else if (typeof errors === 'string') {
              errorMessages.push(`${field}: ${errors}`);
            } else if (typeof errors === 'object') {
              for (const [nestedField, nestedErrors] of Object.entries(errors)) {
                if (Array.isArray(nestedErrors)) {
                  errorMessages.push(`${field}.${nestedField}: ${nestedErrors.join(', ')}`);
                }
              }
            }
          }
          
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join('; ');
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
        
        throw new Error(errorMessage);
      }
      
      if (res.status === 403) {
        throw new Error("You don't have permission to access this resource.");
      }
      
      if (res.status === 404) {
        throw new Error("Resource not found.");
      }
      
      throw new Error(errorData.detail || errorData.message || `Error ${res.status}: ${res.statusText}`);
    }

    const responseData = res.status !== 204 ? await res.json() : null;
    console.log(' API Response Data:', responseData);
    return responseData;
  } catch (err: any) {
    console.error(' API Error:', err);
    throw err;
  }
};

// ========== AUTHENTICATION ==========

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
    
    if (response.user) {
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

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await fetchAPI("accounts/login/", "POST", data);
    
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

// ========== ARTIST PROFILE & PORTFOLIO ==========

// Artist Profile
export const getArtistProfile = () => 
  fetchAPI('artist/profile/', 'GET');

export const updateArtistProfile = (data: any) =>
  fetchAPI('artist/profile/', 'PATCH', data);

// Artist Public Profiles
export const getArtistDetail = (username: string) =>
  fetchAPI(`artist/profiles/${username}/`, 'GET');

export const getArtistById = (id: number) =>
  fetchAPI(`artist/profiles/${id}/`, 'GET');

// Artist Listings (Public)
export const getArtists = (params?: {
  search?: string;
  category?: string;
  skills?: string[];
  location?: string;
  available?: string;
  ordering?: string;
  page?: number;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.location) queryParams.append('location', params.location);
  if (params?.available) queryParams.append('available', params.available);
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  if (params?.page) queryParams.append('page', params.page.toString());
  
  if (params?.skills && params.skills.length > 0) {
    params.skills.forEach(skill => queryParams.append('skills', skill));
  }
  
  const queryString = queryParams.toString();
  const endpoint = `artist/listings/${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(endpoint, 'GET');
};

// Artist Interactions
export const likeArtist = (artistId: number) =>
  fetchAPI(`artist/listings/${artistId}/like/`, 'POST');

export const followArtist = (artistId: number) =>
  fetchAPI(`artist/listings/${artistId}/follow/`, 'POST');

export const requestCommission = (artistId: number, data: any) =>
  fetchAPI(`artist/listings/${artistId}/commission/`, 'POST', data);

// Artist Portfolio Management
export const getPortfolioItems = () =>
  fetchAPI('artist/portfolio/', 'GET');

export const createPortfolioItem = (data: any) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      if (key === 'tags' && Array.isArray(data[key])) {
        data[key].forEach((tag: string) => formData.append('tags', tag));
      } else if (key === 'image' || key === 'video_file') {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  
  return fetchAPI('artist/portfolio/', 'POST', formData, true);
};

export const updatePortfolioItem = (id: number, data: any) =>
  fetchAPI(`artist/portfolio/${id}/`, 'PUT', data);

export const deletePortfolioItem = (id: number) =>
  fetchAPI(`artist/portfolio/${id}/`, 'DELETE');

export const likePortfolioItem = (portfolioId: number) => {
  if (!portfolioId || isNaN(portfolioId)) {
    throw new Error("Valid portfolio ID is required");
  }
  return fetchAPI(`artist/portfolio/${portfolioId}/like/`, 'POST');
};

// Artist Skills Management
export const getArtistSkills = () =>
  fetchAPI('artist/skills/', 'GET');

export const addArtistSkill = (data: any) =>
  fetchAPI('artist/skills/', 'POST', data);

export const updateArtistSkill = (id: number, data: any) =>
  fetchAPI(`artist/skills/${id}/`, 'PUT', data);

export const deleteArtistSkill = (id: number) =>
  fetchAPI(`artist/skills/${id}/`, 'DELETE');

// Artist Experience Management
export const getArtistExperiences = () =>
  fetchAPI('artist/experiences/', 'GET');

export const addArtistExperience = (data: any) =>
  fetchAPI('artist/experiences/', 'POST', data);

export const updateArtistExperience = (id: number, data: any) =>
  fetchAPI(`artist/experiences/${id}/`, 'PUT', data);

export const deleteArtistExperience = (id: number) =>
  fetchAPI(`artist/experiences/${id}/`, 'DELETE');

// Artist Stats
export const getArtistStats = () =>
  fetchAPI('artist/stats/', 'GET');

// Artist Filters
export const getArtistFilters = () =>
  fetchAPI('artist/listings/filters/', 'GET');

// ========== JOB SEEKER ==========

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

export const getJobSeekerListings = (params?: {
  search?: string;
  experience_level?: string;
  skills?: string[];
  location?: string;
  ordering?: string;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.experience_level) queryParams.append('experience_level', params.experience_level);
  if (params?.location) queryParams.append('location', params.location);
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  
  if (params?.skills && params.skills.length > 0) {
    params.skills.forEach(skill => queryParams.append('skills', skill));
  }
  
  const queryString = queryParams.toString();
  const endpoint = `job-seeker/listings/${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(endpoint, 'GET');
};

export const getJobSeekerFilters = () => 
  fetchAPI('job-seeker/listings/filters/', 'GET');

export const getJobSeekerDetail = (username: string) => 
  fetchAPI(`job-seeker/listings/${username}/`, 'GET');

// ========== EMPLOYER ==========

export const getEmployerProfile = () => 
  fetchAPI('employer/profile/', 'GET');

export const createEmployerProfile = (data: any) =>
  fetchAPI('employer/profile/', 'POST', data);

export const updateEmployerProfile = (data: any) =>
  fetchAPI('employer/profile/', 'PATCH', data);

export const uploadCompanyLogo = (file: File) => {
  const formData = new FormData();
  formData.append('logo', file);
  return fetchAPI('employer/profile/upload-logo/', 'POST', formData, true);
};

// Employer Job Management
export const getEmployerJobs = (params?: any) => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const queryString = queryParams.toString();
  const endpoint = `employer/jobs/${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(endpoint, 'GET');
};

export const getEmployerJob = (id: number) => 
  fetchAPI(`employer/jobs/${id}/`, 'GET');

export const createJob = (data: any) =>
  fetchAPI('employer/jobs/', 'POST', data);

export const updateJob = (id: number, data: any) =>
  fetchAPI(`employer/jobs/${id}/`, 'PUT', data);

export const deleteJob = (id: number) =>
  fetchAPI(`employer/jobs/${id}/`, 'DELETE');

export const getJobApplications = (jobId: number) =>
  fetchAPI(`employer/jobs/${jobId}/applications/`, 'GET');

export const updateApplicationStatus = (applicationId: number, status: string) =>
  fetchAPI(`employer/applications/${applicationId}/update_status/`, 'PATCH', { status });

// Job Listings (Public)
export const getJobListings = (params?: any) => {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.job_type) queryParams.append('job_type', params.job_type);
  if (params?.location) queryParams.append('location', params.location);
  if (params?.experience_level) queryParams.append('experience_level', params.experience_level);
  if (params?.remote_option) queryParams.append('remote_option', params.remote_option);
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  if (params?.page) queryParams.append('page', params.page.toString());
  
  if (params?.skills && params.skills.length > 0) {
    params.skills.forEach((skill: string) => queryParams.append('skills', skill));
  }
  
  const queryString = queryParams.toString();
  const endpoint = `employer/listings/jobs/${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(endpoint, 'GET');
};

export const getJobListing = (id: number) => 
  fetchAPI(`employer/listings/jobs/${id}/`, 'GET');

export const applyToJob = (jobId: number, data: any) =>
  fetchAPI(`employer/listings/jobs/${jobId}/apply/`, 'POST', data);

export const saveJob = (jobId: number) =>
  fetchAPI(`employer/listings/jobs/${jobId}/save/`, 'POST');

export const unsaveJob = (jobId: number) =>
  fetchAPI(`employer/saved-jobs/${jobId}/`, 'DELETE');

export const getSavedJobs = () =>
  fetchAPI('employer/saved-jobs/', 'GET');

// ========== INVESTOR API ==========

// Investor Profile
export const getInvestorProfile = () => 
  fetchAPI('investor/profiles/me/', 'GET');

export const createInvestorProfile = (data: any) =>
  fetchAPI('investor/profiles/', 'POST', data);

export const updateInvestorProfile = (data: any) =>
  fetchAPI('investor/profiles/me/', 'PATCH', data);

// Investor Listings (Public)
export const getInvestors = (params?: {
  search?: string;
  investor_type?: string;
  location?: string;
  is_accepting_pitches?: string;
  ordering?: string;
  page?: number;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.investor_type) queryParams.append('investor_type', params.investor_type);
  if (params?.location) queryParams.append('location', params.location);
  if (params?.is_accepting_pitches) queryParams.append('is_accepting_pitches', params.is_accepting_pitches);
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  if (params?.page) queryParams.append('page', params.page.toString());
  
  const queryString = queryParams.toString();
  const endpoint = `investor/profiles/${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(endpoint, 'GET');
};

export const getInvestorDetail = (id: number) =>
  fetchAPI(`investor/profiles/${id}/`, 'GET');

// Investor Stats
export const getInvestorStats = () =>
  fetchAPI('investor/profiles/stats/', 'GET');

// Investor Focus Areas
export const getInvestorFocusAreas = () =>
  fetchAPI('investor/focus-areas/', 'GET');

export const createInvestorFocusArea = (data: any) =>
  fetchAPI('investor/focus-areas/', 'POST', data);

export const updateInvestorFocusArea = (id: number, data: any) =>
  fetchAPI(`investor/focus-areas/${id}/`, 'PUT', data);

export const deleteInvestorFocusArea = (id: number) =>
  fetchAPI(`investor/focus-areas/${id}/`, 'DELETE');

// Pitch Requests
export const createPitchRequest = (data: any) =>
  fetchAPI('investor/pitch-requests/', 'POST', data);

export const getPitchRequests = (params?: {
  status?: string;
  ordering?: string;
  page?: number;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.status) queryParams.append('status', params.status);
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  if (params?.page) queryParams.append('page', params.page.toString());
  
  const queryString = queryParams.toString();
  const endpoint = `investor/pitch-requests/${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(endpoint, 'GET');
};

export const updatePitchRequestStatus = (pitchId: number, status: string, notes?: string) =>
  fetchAPI(`investor/pitch-requests/${pitchId}/update_status/`, 'PATCH', {
    status,
    investor_notes: notes
  });

// Investments
export const createInvestment = (data: any) =>
  fetchAPI('investor/investments/', 'POST', data);

export const getInvestments = (params?: {
  investment_type?: string;
  is_active?: string;
  is_successful?: string;
  ordering?: string;
  page?: number;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.investment_type) queryParams.append('investment_type', params.investment_type);
  if (params?.is_active) queryParams.append('is_active', params.is_active);
  if (params?.is_successful) queryParams.append('is_successful', params.is_successful);
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  if (params?.page) queryParams.append('page', params.page.toString());
  
  const queryString = queryParams.toString();
  const endpoint = `investor/investments/${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(endpoint, 'GET');
};

export const updateInvestment = (id: number, data: any) =>
  fetchAPI(`investor/investments/${id}/`, 'PUT', data);

export const deleteInvestment = (id: number) =>
  fetchAPI(`investor/investments/${id}/`, 'DELETE');

// Artist Interactions & Saved Artists
export const saveArtist = (artistId: number, data?: { notes?: string; priority?: number }) =>
  fetchAPI('investor/saved-artists/', 'POST', { artist: artistId, ...data });

export const getSavedArtists = (params?: {
  ordering?: string;
  page?: number;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  if (params?.page) queryParams.append('page', params.page.toString());
  
  const queryString = queryParams.toString();
  const endpoint = `investor/saved-artists/${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(endpoint, 'GET');
};

export const removeSavedArtist = (id: number) =>
  fetchAPI(`investor/saved-artists/${id}/`, 'DELETE');

export const updateSavedArtist = (id: number, data: { notes?: string; priority?: number }) =>
  fetchAPI(`investor/saved-artists/${id}/`, 'PUT', data);

// Track Interactions
export const trackInteraction = (artistId: number, interactionType: string, notes?: string) =>
  fetchAPI('investor/interactions/', 'POST', {
    artist: artistId,
    interaction_type: interactionType,
    notes
  });

export const getInteractions = (params?: {
  interaction_type?: string;
  ordering?: string;
  page?: number;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.interaction_type) queryParams.append('interaction_type', params.interaction_type);
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  if (params?.page) queryParams.append('page', params.page.toString());
  
  const queryString = queryParams.toString();
  const endpoint = `investor/interactions/${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(endpoint, 'GET');
};

// Discover Artists
export const discoverArtists = (params?: {
  page?: number;
  page_size?: number;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  
  const queryString = queryParams.toString();
  const endpoint = `investor/discover-artists/${queryString ? `?${queryString}` : ''}`;
  
  return fetchAPI(endpoint, 'GET');
};

// Investment Milestones
export const getInvestmentMilestones = (investmentId: number) =>
  fetchAPI(`investor/milestones/?investment=${investmentId}`, 'GET');

export const createInvestmentMilestone = (data: any) =>
  fetchAPI('investor/milestones/', 'POST', data);

export const updateInvestmentMilestone = (id: number, data: any) =>
  fetchAPI(`investor/milestones/${id}/`, 'PUT', data);

export const deleteInvestmentMilestone = (id: number) =>
  fetchAPI(`investor/milestones/${id}/`, 'DELETE');

// Helper function for file uploads
export const uploadPitchDeck = (file: File) => {
  const formData = new FormData();
  formData.append('pitch_deck', file);
  return fetchAPI('investor/pitch-requests/upload-pitch-deck/', 'POST', formData, true);
};

export const uploadFinancialProjections = (file: File) => {
  const formData = new FormData();
  formData.append('financial_projections', file);
  return fetchAPI('investor/pitch-requests/upload-financial-projections/', 'POST', formData, true);
};

// ========== LEGACY FUNCTIONS (Keep for backward compatibility) ==========

// These were in your original file but might not be used anymore
export const getArtist = (body: any) => 
  fetchAPI("profiles/artists/", "POST", body);

export const getJobs = () => 
  fetchAPI("jobs/", "GET");

export const getJob = (id: string) => 
  fetchAPI(`jobs/${id}/`, "GET");

// This one should now use the new getInvestors function above
export const getAllInvestors = () => getInvestors();
