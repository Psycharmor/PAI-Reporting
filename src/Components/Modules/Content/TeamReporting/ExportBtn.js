import React from "react";

import {CSVLink} from "react-csv";

export default function ExportBtn(props) {
    const csvData = createCsvData(props);
    return (
        <CSVLink
            className={"btn pa-btn"}
            data={csvData}
            filename={"pai-survey-report-" + Math.floor(Date.now() / 1000) + ".csv"}
            target={"_blank"}
            rel={"noopener noreferrer"}
        >
            {"Download Results"}
        </CSVLink>
    );
};

function createCsvData(props) {
    let data = [
        createHeaders(props)
    ];
    const pActivities = parseActivities(props["activities"]);
    const courseIds = props["group"]["courses"];
    const userIds = props["group"]["enrolledUsers"];

    for (let i = 0; i < userIds.length; ++i) {
        const userId = userIds[i];
        let courseCompletedCount = 0;
        let row = [
            props["users"][userId]["firstName"],
            props["users"][userId]["lastName"],
            props["users"][userId]["email"],
            "0"
        ];
        for (let i = 0; i < courseIds.length; ++i) {
            const courseId = courseIds[i];
            let coursePercent = "0%";
            if ((userId in pActivities) && (courseId in pActivities[userId])) {
                const stepsCompleted = pActivities[userId][courseId]["stepsCompleted"];
                const stepsTotal = pActivities[userId][courseId]["stepsTotal"];
                if (stepsTotal !== 0) {
                    if (stepsCompleted === stepsTotal) {
                        ++courseCompletedCount;
                    }
                    coursePercent = (+(stepsCompleted / stepsTotal * 100).toFixed(2)) + "%";
                }
            }
            row.push(coursePercent);
        }
        row[3] = courseCompletedCount + "/" + courseIds.length;
        data.push(row);
    }

    return data;
}

function createHeaders(props) {
    let headers = ["First Name", "Last Name", "Email", "Courses Completed"];
    for (let i = 0; i < props["group"]["courses"].length; ++i) {
        const courseId = props["group"]["courses"][i];
        const course = props["courses"][courseId];
        headers.push(course["title"]);
    }

    return headers;
}

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
