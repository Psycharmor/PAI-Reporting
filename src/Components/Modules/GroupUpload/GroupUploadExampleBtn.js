import React from "react";

import {CSVLink} from "react-csv";

export default function GroupUploadExampleBtn(props) {
    const data = [
        ["first_name","last_name","username", "email"],
        ["exampleUsername", "exampleUsername", "exampleUsername", "exampleEmail@email.com"],
        ["anotherUser", "anotherUser", "anotherUser", "theotheruser@email.com"]
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
