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

function getSelectOptions(comments, portfolioId) {
    let options = [
        <option key={0} value={0}>{"All Courses"}</option>
    ];
    let found = [];
    for (let i in comments ){

    // for (let i = 0; i < comments.length; ++i) {
        const comment = comments[i];
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
