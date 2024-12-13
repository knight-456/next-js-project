import axios from "axios";

export const lmsApiInstance = () => {

    const instance = axios.create({
        baseURL: `http://localhost:3000/api`,
        responseType: "json",
        headers: { 'Content-Type': "application/json" }
    })

    return instance
};