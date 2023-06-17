import { create } from 'apisauce';

const api = create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

api.addRequestTransform((request) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  request.headers.Authorization = `Bearer ${token}`;
});

api.addResponseTransform((response) => {
  if (!response.ok) {
    localStorage.removeItem("ACCESS_TOKEN");
  }
});

export default api;
