import React from "react";

import {Card, CardHeader, CardBody} from "reactstrap";

import MultiSelect from "../../Forms/MultiSelect";

export default function GroupUploadCourses(props) {
    return (
        <Card className={"height-100-percent"}>
            <CardHeader className={"pai-card-header"}>
                <h3>{"Course Select"}</h3>
                <h5>{"Choose which courses will be completed for the users"}</h5>
            </CardHeader>
            <CardBody className={"pai-card-body"}>
                <MultiSelect
                    class={"height-100-percent"}
                    values={props["courseIds"]}
                    optionPairs={props["courseOptions"]}
                    onChangeHandler={props["coursesChangeHandler"]}
                />
            </CardBody>
        </Card>
    );
};
