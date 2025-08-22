import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/investor-profile",
});

export const getAllInvestors = async () => {
  const res = await api.get("/investor-profile");
  return res.data;
}

export const getInvestorProfile = async (id) => {
  const res = await api.get(`/investor-profile/${id}`);
  return res.data;
};

export const createInvestorProfile = async (data) => {
  const res = await api.post(`/investor-profile`, data);
  return res.data;
};

export const updateInvestorProfile = async (id, data) => {
  const res =await api.patch(`/investor-profile/${id}`, data);
  return res.data;
};

export const deleteInvestor = async (id) => {
  const res = await axios.delete(`${API_URI}/${id}`);
  return res.data;
};

// Focus area
export const addFocusArea = async (id, focusAreaId) => {
  const res = await axios.post(`${API_URL}/${id}/focus-areas`, { focusAreaId });
  return res.data;
};

export const removeFocusArea = async (id, focusAreaId) => {
  const res = await axios.delete(`${API_URL}/${id}/focus_areas/${focusAresId}`);
  return res.data;
};

// Investment stages
export const addInvestmentStage = async (id, stageId) => {
  const res = await axios.post(`${API_URL}/${id}investment_stages`, { stageId });
  return res.data;
};

export const removeInvestmentStage = async (id, stageId) => {
  const res = await axios.delete(`${API_URL}/${id}/investment-stages/${stageId}`);
  return res.data;
};


