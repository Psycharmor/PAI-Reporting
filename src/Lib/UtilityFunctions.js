/*
    Any additional helper functions that other files here might use
*/

const UtilityFunctions = {
    isObjEmpty: function(obj) {
        for (let key in obj) {
            return false;
        }
        return true;
    },
    getBgColors: function(categories) {
        let bgColors = [];
        for (let categoryKey in categories) {
            bgColors.push("rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")");
        }

        return bgColors;
    }
};
export default UtilityFunctions;
