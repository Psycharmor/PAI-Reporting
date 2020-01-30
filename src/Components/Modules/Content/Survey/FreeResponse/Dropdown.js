import React from "react";

import {Input} from "reactstrap";

export default function Dropdown(props) {
    const options = getOptions(props["options"]);

    return (
        <Input className={"team-report-dropdown"} type={"select"} value={props["value"]} onChange={props["changeHandler"]}>
            {options}
        </Input>
    );
};

function getOptions(optionsProp) {
    let options = [];
    for (let i = 0; i < optionsProp.length; ++i) {
        options.push(
            <option key={optionsProp[i]} value={optionsProp[i]}>
                {optionsProp[i]}
            </option>
        );
    }

    return options;
}
