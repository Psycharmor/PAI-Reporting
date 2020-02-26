import React from "react";

import {Input} from "reactstrap";

export default function MultiSelect(props) {
    const options = getOptions(props["optionPairs"]);

    return (
        <Input
            className={"multi-select " + (props["class"] || "")}
            type={"select"}
            value={props["values"]}
            onChange={props["onChangeHandler"]}
            multiple={true}
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
