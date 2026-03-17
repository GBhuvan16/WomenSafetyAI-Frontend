import axios from "axios";

const BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080";

export const sendMessage = async(message) => {
    const res = await axios.post(`${BASE_URL}/chat`, { message });
    return res.data;
};

export const sendSOS = async(lat, lng) => {
    const link = `https://maps.google.com/?q=${lat},${lng}`;
    const res = await axios.post(`${BASE_URL}/sos`, { lat, lng, link });
    return res.data;
};