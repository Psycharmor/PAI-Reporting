import React from "react";

import {Input} from "reactstrap";

export default function PortfolioDropdown(props) {
    const options = getSelectOptions(props["comments"]);
    return (
        <Input className={"team-report-dropdown"} type={"select"} value={props["portfolioId"]} onChange={props["eventHandler"]}>
            {options}
        </Input>
    );
};

function getSelectOptions(comments) {
    let options = [
        <option key={0} value={0}>{"All Portfolios"}</option>
    ];
    let found = [];
    // for (let i = 0; i < surveyEntries.length; ++i) {
    for (let i in comments ){
        const comment = comments[i];
        if (typeof comment["portfolio"] === "object" && !found.includes(comment["portfolio"]["id"]) && comment["portfolio"]["id"]) {
            found.push(comment["portfolio"]["id"]);
            options.push(
                <option key={comment["portfolio"]["id"]} value={comment["portfolio"]["id"]}>{comment["portfolio"]["name"]}</option>
            );
        }
    }

    return options;
}
