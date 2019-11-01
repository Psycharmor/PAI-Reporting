import React from "react";

import {Select, MenuItem} from "@material-ui/core";

import {AUTH_TOKEN} from "../helper";

const GroupSelect = (props) => {
    const user = JSON.parse(localStorage.getItem(AUTH_TOKEN));

    let options = [];
    for (let i = 0; i < user["group"].length; ++i) {
        const group = user["group"][i];
        const selected = (props["groupId"] === group["id"] ? true : false);
        options.push(
            <MenuItem key={group["id"]} value={group["id"]} selected={selected}>{group["name"]}</MenuItem>
        );
    }

    return (
        <Select
            value={props["groupId"]}
            onChange={(e) => props["groupChangeHandler"](e.target["value"])}
        >
            {options}
        </Select>

    );
};
export default GroupSelect;
