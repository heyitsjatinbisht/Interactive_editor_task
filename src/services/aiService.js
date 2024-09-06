import api from "./api";

export const fetchFromOpenAI = async (token, payload) => {
  try {
    const payloadData =
      typeof payload === "string"
        ? {
            model: "text-davinci-003",
            maxWords: 300,
            prompt: payload,
          }
        : payload;

    const response = await api.post(
      "/api/v1/eddie",
      {
        ...payloadData,
        stream: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Raw Response:", response.data);

    return response.data;
  } catch (err) {
    console.error("Error fetching from OpenAI:", err.message || err);
    throw err;
  }
};
