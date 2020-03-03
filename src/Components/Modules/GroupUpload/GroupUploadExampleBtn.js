import React from "react";

import {CSVLink} from "react-csv";

export default function GroupUploadExampleBtn(props) {
    const data = [
        ["username", "email"],
        ["exampleUsername", "exampleEmail@email.com"],
        ["anotherUser", "theotheruser@email.com"]
    ];
    return (
        <CSVLink
            className={"btn pai-btn"}
            data={data}
            filename={"psycharmor-upload-example-" + Math.floor(Date.now() / 1000) + ".csv"}
            target={"_blank"}
            rel={"noopener noreferrer"}
        >
            {"Download Example"}
        </CSVLink>
    );
}
