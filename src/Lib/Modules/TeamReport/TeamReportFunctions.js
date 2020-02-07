/*
    All functions related to parsing/computing info for the Team Report view
*/
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
    getTableData: function(group, users, activities) {
        const pActivities = parseActivities(activities, group["userIds"]);
        let data = [];
        const courseIds = group["courseIds"];
        const userIds = group["userIds"];

        for (let i = 0; i < userIds.length; ++i) {
            const userId = userIds[i];
            let courseCompletedCount = 0;
            let row = {
                firstName: users[userId]["firstName"],
                lastName: users[userId]["lastName"],
                email: users[userId]["email"]
            };

            for (let i = 0; i < courseIds.length; ++i) {
                const courseId = courseIds[i];
                row[courseId] = 0;
                if ((userId in pActivities) && (courseId in pActivities[userId])) {
                    const stepsCompleted = pActivities[userId][courseId]["stepsCompleted"];
                    const stepsTotal = pActivities[userId][courseId]["stepsTotal"];
                    if (stepsTotal !== 0) {
                        if (stepsCompleted === stepsTotal) {
                            ++courseCompletedCount;
                        }
                        row[courseId] = stepsCompleted / stepsTotal * 100;
                    }
                }
            }
            row["completed"] = courseCompletedCount;

            data.push(row);
        }

        return data;
    }
};
export default TeamReportFunctions;

function parseActivities(activities, groupUsers) {
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
}

function courseProgressComparator(a, b, order) {
    const aValue = parseFloat(a);
    const bValue = parseFloat(b);

    return (order === "asc") ? bValue - aValue : aValue - bValue;
}

function courseProgressRenderer(cell, row, rowIndex, formatExtraData) {
    return +(cell.toFixed(2)) + "%";
}

function courseCompletedComparator(a, b, order) {
    const aValue = parseInt(a);
    const bValue = parseInt(b);

    return (order === "asc") ? bValue - aValue : aValue - bValue;
}

function courseCompletedRenderer(cell, row, rowIndex, formatExtraData) {
    return cell + "/" + formatExtraData["courseCount"];
}
