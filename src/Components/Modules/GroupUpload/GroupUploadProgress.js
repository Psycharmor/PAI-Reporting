import React from "react";

import {Card, CardHeader, CardBody, Progress} from "reactstrap";

export default function GroupUploadProgress(props) {
    return (
        <Card className={"height-100-percent"}>
            <CardHeader className={"pai-card-header"}>
                <h3>{"Upload Progress"}</h3>
            </CardHeader>
            <CardBody className={"pai-card-body"}>
                <Progress value={props["progress"]}/>
            </CardBody>
        </Card>
    );
};
