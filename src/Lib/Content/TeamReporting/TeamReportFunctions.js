/*
    All the functions related to computation/info parsing for the Team Report View
*/
const TeamReportFunctions = {

    /*
        Get all the header information for the Team Reporting Table
        Params:
            groupInfo       -> (object) info about the group
            groupCourses    -> (object) info about the group courses
        Return:
            array -> the header data to be sent to the table
    */
    getTeamReportHeaders: function(groupInfo, courses) {
        if (!groupInfo || Object.keys(groupInfo).length === 0) {
            return [];
        }

        // initialize the headers array with the username field
        let headers = [{
            text: "Username",
            dataField: "username",
            sort: true
        }];
        for (let i = 0; i < groupInfo["courses"].length; ++i) {
            const courseId = groupInfo["courses"][i];
            const course = courses[courseId];
            headers.push({
                text: course["title"],
                dataField: courseId.toString(),
                sort: true,
                sortFunc: courseDataComparator
            });
        }

        return headers;
    },

    /*
        Get all the data for the Team Reporting Table
        Params:
            groupInfo       -> (object) info about the group
            users           -> (object) all user info assigned to the group
            activities      -> (object) all course activity
        Return:
            array -> the data for each header to be sent to the table
    */
    getTeamReportData: function(groupInfo, users, activities) {
        if (!groupInfo || Object.keys(groupInfo).length === 0) {
            return [];
        }

        let data = [];
        const pActivities = parseActivities(activities);

        const courseIds = groupInfo["courses"];
        const userIds = groupInfo["enrolledUsers"];
        for (let i = 0; i < userIds.length; ++i) {
            const userId = userIds[i];
            let row = {
                username: users[userId]["username"]
            };

            for (let i = 0; i < courseIds.length; ++i) {
                const courseId = courseIds[i];
                row[courseId] = "0%";
                if ((userId in pActivities) && (courseId in pActivities[userId])) {
                    const stepsCompleted = pActivities[userId][courseId]["stepsCompleted"];
                    const stepsTotal = pActivities[userId][courseId]["stepsTotal"];
                    if (stepsTotal === 0) {
                        row[courseId] = 0 + "%";
                    }
                    else {
                        row[courseId] = (+(stepsCompleted / stepsTotal * 100).toFixed(2)) + "%";
                    }
                }
            }

            data.push(row);
        }

        return data;
    }
};
export default TeamReportFunctions;

/*
    Create a new object for activities where the main key is the user id
    Params:
        activities -> (object) all the activities done by the group
    Return:
        (object) a reformatted activitites object where the main key is the user id
*/
function parseActivities(activities) {
    const pActivities = {};
    for (let activityId in activities) {
        const activity = activities[activityId];
        const userId = activity["userId"];
        if (!(userId in pActivities)) {
            pActivities[userId] = {};
        }
        pActivities[userId][activity["courseId"]] = activity;
    }

    return pActivities;
}

/*
    Compare function for course data sorting. Normal numerical sort but first have to
    change the data to an int.
    Params:
        a -> (string) one of the items that will be compared (a user's course progress)
        b -> (string) one of the items that will be compared (a user's course progress)
        order -> (string) defines whether the sort will be 'asc' or 'desc' order
    Return:
        int -> an indication of where a should be relative to b
*/
function courseDataComparator(a, b, order) {
    const aValue = parseFloat(a.substring(0, a.length - 1));
    const bValue = parseFloat(b.substring(0, b.length - 1));

    return (order === "asc") ? bValue - aValue : aValue - bValue;
}
