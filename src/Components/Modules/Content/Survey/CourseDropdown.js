import React from "react";

import {Input} from "reactstrap";

export default function CourseDropdown(props) {
    const options = getSelectOptions(props["surveyEntries"][props["portfolioId"]]["courses"]);
    return (
        <Input className={"team-report-dropdown"} type={"select"} value={props["courseId"]} onChange={props["eventHandler"]}>
            {options}
        </Input>
    );
};

function getSelectOptions(courses) {
    let options = [
        <option key={0} value={0}>{"All Courses"}</option>
    ];
    for (let courseId in courses) {
        const name = courses[courseId]["name"];
        options.push(
            <option key={courseId} value={courseId}>{name}</option>
        );
    }

    return options;
}
