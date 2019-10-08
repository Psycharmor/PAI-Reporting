import { AUTH_TOKEN } from '../helper';

class ApiCaller {

    constructor(endPoint) {
        this.user = JSON.parse(localStorage.getItem(AUTH_TOKEN));
    }

    getApiResult(groupId, endpoint) {
        const request = this.createRequestObject(groupId, endpoint);
        return fetch(request)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw new Error("Bad Response");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    createRequestObject(groupId, endpoint) {
        const activityUrlWithQueryArgs = endpoint + this.createQueryArgs(groupId);
        console.log(activityUrlWithQueryArgs);
        const requestOptions = {
            method: "GET",
            headers: { Authorization: "Bearer " + this.user.token },
            mode: "cors"
        };

        return new Request(activityUrlWithQueryArgs, requestOptions);
    }

    createQueryArgs(groupId) {
        return "?groupid=" + groupId;
    }
}
export default ApiCaller;
