import axios from "axios";

export const lmsApiInstance = () => {

    const instance = axios.create({
        baseURL: `/api`,
        responseType: "json",
        headers: { 'Content-Type': "application/json" }
    })

    return instance
};