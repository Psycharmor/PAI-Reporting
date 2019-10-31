import {AUTH_TOKEN} from "../helper";

class ApiCaller {

    constructor() {
        this.user = JSON.parse(localStorage.getItem(AUTH_TOKEN));
    }

    getApiResult(id, queryArg, endpoint) {
        const request = this.createRequestObject(id, queryArg, endpoint);
        return fetch(request)
               .then((response) => {
                   if (response.ok) {
                       return response.json();
                   }
                   else {
                       throw new Error("getApiResult: Bad Response");
                   }
               })
               .catch((err) => {
                   console.log("getApiResult", err);
               });
    }

    createRequestObject(id, queryArg, endpoint) {
        const url = endpoint + this.createQueryArgs(id, queryArg);
        console.log(url);
        const requestOptions = {
            method: "GET",
            headers: {Authorization: "Bearer " + this.user.token},
            mode: "cors"
        };

        return new Request(url, requestOptions);
    }

    createQueryArgs(id, queryArg) {
        return "?" + queryArg + "=" + id;
    }
}
export default ApiCaller;
