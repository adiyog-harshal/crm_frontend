import api from "../api/axiosConfig";

export const useAuth = () => {
  const login = async (email, password) => {
    const response = await api.post("login/", {
      email: email,
      password: password,
    });

    console.log("LOGIN API RESPONSE:", response.data);

    localStorage.setItem(
      "crm_user",
      JSON.stringify(response.data.user)
    );

    // If backend returns a token
    if (response.data.token) {
      localStorage.setItem("access_token", response.data.token);
    }

    // If backend returns JWT access token
    if (response.data.access) {
      localStorage.setItem("access_token", response.data.access);
    }

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("crm_user");
    localStorage.removeItem("access_token");
  };

  return {
    login,
    logout,
  };
};