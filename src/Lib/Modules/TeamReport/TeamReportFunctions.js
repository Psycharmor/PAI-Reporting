/*
    All functions related to parsing/computing info for the Team Report view
*/
import moment from "moment";


const TeamReportFunctions = {
    getTableHeaders: function(group, courses) {
        let headers = [
            {
                text: "First Name",
                dataField: "firstName",
                sort: true
            },
            {
                text: "Last Name",
                dataField: "lastName",
                sort: true
            },
            {
                text: "Email",
                dataField: "email",
                sort: true
            },
            {
                text: "Organisation",
                dataField: "organisation",
                sort: true
            },
            {
                text: "Courses Completed",
                dataField: "completed",
                sort: true,
                sortFunc: courseCompletedComparator,
                formatter: courseCompletedRenderer,
                formatExtraData: {
                    courseCount: group["courseIds"].length
                }
            }
        ];

        for (let i = 0; i < group["courseIds"].length; ++i) {
            const courseId = group["courseIds"][i];
            const course = courses[courseId];
            headers.push({
                text: course["title"],
                dataField: courseId.toString(),
                sort: true,
                sortFunc: courseProgressComparator,
                formatter: courseProgressRenderer
            });
        }

        return headers;
    },

    getTableData: function(group, users, activities, props) {
        const pActivities = TeamReportFunctions.parseActivities(activities, group["userIds"]);
        let data = [];

        const courseIds = group["courseIds"];
        const userIds = group["userIds"];

        for (let i = 0; i < userIds.length; ++i) {
            const userId = userIds[i];
            let courseCompletedCount = 0;


            let row = {
                firstName: users[userId]?.["firstName"],
                lastName: users[userId]?.["lastName"],
                email: users[userId]?.["email"],
                organisation: users[userId]?.["organization"],
            };

            for (let i = 0; i < courseIds.length; ++i) {
                const courseId = courseIds[i];
                row[courseId] = 0;
                if ((userId in pActivities) && (courseId in pActivities[userId])) {
                    if (TeamReportFunctions.isFilteredActivity(props, pActivities[userId][courseId])) {

                        /// DateCompleted for each course
                        const dateCompleted = pActivities[userId][courseId]["completed"];

                        const stepsCompleted = pActivities[userId][courseId]["stepsCompleted"];
                        const stepsTotal = pActivities[userId][courseId]["stepsTotal"];


                        if (stepsTotal !== 0) {
                            if (stepsCompleted === stepsTotal) {
                                ++courseCompletedCount;
                            }
                            row[courseId] = dateCompleted
                            // row[dateCompleted] = dateCompleted;
                        }
                    }
                }
            }
            row["completed"] = courseCompletedCount;
            // row["dateCompleted"] = dateCompleted;
            data.push(row);
        }
        // console.log("data", data);

        return data;
    },

    parseActivities: function(activities, groupUsers) {
        const pActivities = {};
        for (let activityId in activities) {
            const activity = activities[activityId];
            const userId = activity["userId"];
            if (groupUsers.includes(userId)) {
                if (!(userId in pActivities)) {
                    pActivities[userId] = {};
                }
                pActivities[userId][activity["courseId"]] = activity;
            }
        }

        return pActivities;
    },

    isFilteredActivity: function(props, activity) {
        if (props["startDate"].unix() > activity["completed"]) {
            return false;
        }

        if (props["endDate"].unix() < activity["completed"]) {
            return false;
        }

        return true;
    },

    isFilteredUser: function(props, registeredDateUnix) {

        if (props["startDate"].unix() > registeredDateUnix ) {
            return false;
        }

        if (props["endDate"].unix() < registeredDateUnix) {
            return false;
        }

        return true;
    }

};
export default TeamReportFunctions;

function courseProgressComparator(a, b, order) {
    const aValue = parseFloat(a);
    const bValue = parseFloat(b);

    return (order === "asc") ? bValue - aValue : aValue - bValue;
}

function courseProgressRenderer(cell, row, rowIndex, formatExtraData) {

    var dateTimeString = moment(cell * 1000 ).format("DD-MM-YYYY");
    if ( cell !== 0 ){
      return dateTimeString;
    }else{
      return '';
    }
}

function courseCompletedComparator(a, b, order) {
    const aValue = parseInt(a);
    const bValue = parseInt(b);

    return (order === "asc") ? bValue - aValue : aValue - bValue;
}

function courseCompletedRenderer(cell, row, rowIndex, formatExtraData) {

    return cell + "/" + formatExtraData["courseCount"];
}
