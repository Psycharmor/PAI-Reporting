import React from "react";

import {Input} from "reactstrap";

export default function PortfolioDropdown(props) {
    const options = getSelectOptions(props["surveyEntries"]);
    return (
        <Input className={"team-report-dropdown"} type={"select"} value={props["portfolioId"]} onChange={props["eventHandler"]}>
            {options}
        </Input>
    );
};

function getSelectOptions(surveyEntries) {
    let options = [
        <option key={0} value={0}>{"All Portfolios"}</option>
    ];
    for (let portfolioId in surveyEntries) {
        const name = surveyEntries[portfolioId]["name"];
        options.push(
            <option key={portfolioId} value={portfolioId}>{name}</option>
        );
    }

    return options;
}
