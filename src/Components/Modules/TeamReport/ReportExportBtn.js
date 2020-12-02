import React from "react";
import moment from "moment";

import {CSVLink} from "react-csv";

import TeamReportFunctions from "../../../Lib/Modules/TeamReport/TeamReportFunctions";

export default function ReportExportBtn(props) {
    const data = createData(props);
    return (
        <CSVLink
            className={"btn pai-btn report-export-btn"}
            data={data}
            filename={"psycharmor-survey-report-" + Math.floor(Date.now() / 1000) + ".csv"}
            target={"_blank"}
            rel={"noopener noreferrer"}
        >
            {"Download Report"}
        </CSVLink>
    );
}

function createData(props) {
    let data = [createHeaders(props)];
    const userIds = props["group"]["userIds"];
    const courseIds = props["group"]["courseIds"];
    const pActivities = TeamReportFunctions.parseActivities(props["activities"], userIds);

    for (let i = 0; i < userIds.length; ++i) {
        const userId = userIds[i];
        let courseCompletedCount = 0;
        let row = [
            props["users"][userId]["firstName"],
            props["users"][userId]["lastName"],
            props["users"][userId]["email"],
            "0/" + courseIds.length
        ];
        for (let i = 0; i < courseIds.length; ++i) {
            const courseId = courseIds[i];
            let coursePercent = " ";
            if ((userId in pActivities) && (courseId in pActivities[userId])) {

                const dateCompleted = pActivities[userId][courseId]["completed"];
                const stepsCompleted = pActivities[userId][courseId]["stepsCompleted"];
                const stepsTotal = pActivities[userId][courseId]["stepsTotal"];
                if (stepsTotal !== 0) {
                    if (stepsCompleted === stepsTotal) {
                        ++courseCompletedCount;
                    }
                   // coursePercent = dateCompleted ;

                    if( dateCompleted !== 0){
                        coursePercent  = moment(dateCompleted * 1000 ).format("MM/DD/YYYY");
                    }else{
                        coursePercent = '';
                    }

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
    for (let i = 0; i < props["group"]["courseIds"].length; ++i) {
        const courseId = props["group"]["courseIds"][i];
        const course = props["courses"][courseId];
        headers.push(course["title"]);
    }

    return headers;
}


function formatDateTime(dateString) {
    const parsed = moment(new Date(dateString))

    if (!parsed.isValid()) {
        return dateString
    }

    return parsed.format('MMM D, YYYY, HH:mmA')
}
