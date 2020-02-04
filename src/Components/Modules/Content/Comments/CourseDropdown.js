import React from "react";

import {Input} from "reactstrap";

export default function CourseDropdown(props) {
    const options = getSelectOptions(props["comments"], props["portfolioId"]);
    return (
        <Input className={"team-report-dropdown"} type={"select"} value={props["courseId"]} onChange={props["eventHandler"]}>
            {options}
        </Input>
    );
};

function getSelectOptions(surveyEntries, portfolioId) {
    let options = [
        <option key={0} value={0}>{"All Courses"}</option>
    ];
    let found = [];
    for (let i = 0; i < surveyEntries.length; ++i) {
        const comment = surveyEntries[i];
        if (typeof comment["portfolio"] === "object" && comment["portfolio"]["id"] === portfolioId) {
            if (!found.includes(comment["postTitle"])) {
                found.push(comment["postTitle"]);
                options.push(
                    <option key={comment["postTitle"]} value={comment["postTitle"]}>{comment["postTitle"]}</option>
                );
            }
        }
    }

    return options;
}
