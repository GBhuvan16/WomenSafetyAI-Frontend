import axios from "axios";

export const sendMessage = async(message) => {
    const res = await axios.post("http://localhost:8080/chat", {
        message: message,
    });

    return res.data;
};