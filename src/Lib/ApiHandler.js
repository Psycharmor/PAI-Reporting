import axios from "axios";

const ApiHandler = {
    get: async function(url, options) {
        const data = await axios.get(url, options);
        return data;
    },
    post: async function(url, body, options) {
        const data = await axios.post(url, body, options);
        return data;
    }
};
export default ApiHandler;
