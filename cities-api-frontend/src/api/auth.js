import apiConfig from "./config";

async function signin(inputData) {
  const response = await apiConfig.post('/users/login', inputData);
  
  const { token, data } = response.data;
  
  localStorage.setItem('token', token);
  
  apiConfig.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  return {
    token,
    user: data,
  };
}

async function signup(inputData) {
  const response = await apiConfig.post('/users/register', inputData);
  
  const { token, data } = response.data;
  
  localStorage.setItem('token', token);
  
  apiConfig.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  return {
    token,
    user: data,
  };
}

function logout() {
  localStorage.removeItem('token');
  delete apiConfig.defaults.headers.common['Authorization'];
}

function getToken() {
  return localStorage.getItem('token');
}

function isAuthenticated() {
  return !!getToken();
}

const token = getToken();
if (token) {
  apiConfig.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const authApi = {
  signin,
  signup,
  logout,
  getToken,
  isAuthenticated,
};

export default authApi;
