import React from "react";

import {Input} from "reactstrap";

export default function GroupDropdown(props) {
    if (Object.keys(props["groups"]).length > 0) {
        let options = [<option key={0} value={0}>{"Select Group"}</option>];
        for (let groupId in props["groups"]) {
            options.push(
                <option key={groupId} value={groupId}>{props["groups"][groupId]["title"]}</option>
            );
        }

        return (
            <Input className={"team-report-dropdown"} type={"select"} value={props["groupId"]} onChange={props["groupChangeHandler"]}>
                {options}
            </Input>
        );
    }

    return(<div></div>);
};
