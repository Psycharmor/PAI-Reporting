import React from "react";

import {Row, Col} from "reactstrap";

import UserDemographicsTable from "./UserDemographicsTable";

/*
    Component renders the User Demographics survey content
*/
export default function UserDemographics(props) {
    if (Object.keys(props["surveyEntries"]).length > 0) {
        return (
            <Row className={"survey-row-margin"}>
                <Col>
                    <UserDemographicsTable
                        surveyEntries={props["surveyEntries"]}
                        portfolioId={props["portfolioId"]}
                        courseId={props["courseId"]}
                        filters={props["filters"]}
                    />
                </Col>
            </Row>
        );
    }
};
