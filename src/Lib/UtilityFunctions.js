/*
    Any additional helper functions that other files here might use
*/

const UtilityFunctions = {
    isObjEmpty: function(obj) {
        for (let key in obj) {
            return false;
        }
        return true;
    }
};
export default UtilityFunctions;
