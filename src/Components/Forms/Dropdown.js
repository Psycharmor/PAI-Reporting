import React from "react";

import {Input} from "reactstrap";

export default function Dropdown(props) {
    const options = getOptions(props["optionPairs"]);

    return (
        <Input
            className={"dropdown"}
            type={"select"}
            value={props["value"]}
            onChange={props["onChangeHandler"]}
        >
            {options}
        </Input>
    );
};

function getOptions(optionPairs) {
    let options = [];
    for (let i = 0; i < optionPairs.length; ++i) {
        options.push(
            <option key={optionPairs[i]["key"]} value={optionPairs[i]["value"]}>
                {optionPairs[i]["label"]}
            </option>
        );
    }

    return options;
}
