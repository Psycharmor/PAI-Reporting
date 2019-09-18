import { AUTH_TOKEN } from '../helper';
import WPAPI from '../service/wpClient';

class ApiCaller {

    constructor() {
        this.user = JSON.parse(localStorage.getItem(AUTH_TOKEN));
        this.activityUrl = WPAPI.userActsEndpoint;
    }

    getActivityFromGroup(groupId, limit, offset) {
        const request = this.createRequestObject(groupId, limit, offset);
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
            }
        );
    }

    createRequestObject( groupId, limit, offset ) {
        const activityUrlWithQueryArgs = this.activityUrl + this.createQueryArgs(groupId, limit, offset);
        console.log(activityUrlWithQueryArgs);
        const requestOptions = {
            method: "GET",
            headers: { Authorization: "Bearer " + this.user.token },
            mode: "cors"
        };

        return new Request(activityUrlWithQueryArgs, requestOptions);
    }

    createQueryArgs(groupId, limit, offset) {
        return "?group_id=" + groupId + "&limit=" + limit + "&offset=" + offset;
    }
}
export default ApiCaller;
