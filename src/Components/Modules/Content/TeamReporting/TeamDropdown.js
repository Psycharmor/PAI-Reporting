import React from "react";

import {Input} from "reactstrap";

export default function TeamDropdown(props) {
    const user = JSON.parse(localStorage.getItem("USER"));
    const options = getSelectOptions(user["group"]);

    return (
        <Input className={"team-report-dropdown"} type={"select"} value={props["teamId"]} onChange={props["teamChangeHandler"]}>
            {options}
        </Input>
    );
};

function getSelectOptions(groups) {
    let options = [];
    for (let i = 0; i < groups.length; ++i) {
        const group = groups[i];
        options.push(
            <option key={group["id"]} value={group["id"]}>
                {group["name"]}
            </option>
        );
    }

    return options;
}
