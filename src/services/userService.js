import api from "./api";

export const signUp = async (userData) => {
  try {
    const res = await api.post("/auth/signup", userData);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

export const login = async (userData) => {
  try {
    const res = await api.post("/auth/login", userData);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const fetchUserDetail = async (token) => {
  try {
    const res = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
