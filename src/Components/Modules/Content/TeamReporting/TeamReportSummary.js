import React from "react";

import {Card, CardBody, Row, Col} from "reactstrap";

export default function TeamReportSummary(props) {
    return (
        <Card className={"team-report-card"}>
            <CardBody className={"team-report-card-body"}>
                <Row>
                    <Col>
                        <h3>{props["title"]}</h3>
                        <h2>{props["content"]}</h2>
                    </Col>
                    <Col xs={"auto"}>
                        <span className={"team-report-card-icon " + props["class"]}>
                            {props["icon"]}
                        </span>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};
