/*
    Does API Calls
*/

class ApiHandler {

    /*
        Does the api call given the request.
        Params:
            request -> (Request) the api request info
        Return:
            Promise -> the results of the api call
    */
    static doApiCall(request) {
        return fetch(request)
               .then((response) => {
                   if (response.ok) {
                       return response.json();
                   }
                   else {
                       throw new Error("ApiHandler.doApiCall: Bad response");
                   }
               })
               .catch((err) => {
                   console.log("Promise Catch: ApiHandler.doApiCall", err);
               });
    }
}
export default ApiHandler;
