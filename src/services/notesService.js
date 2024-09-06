import api from "./api";

export const createNote = async (token, noteData) => {
  try {
    const res = await api.post("/notes", noteData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

export const getNotes = async (token) => {
  try {
    const res = await api.post("/notes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};
