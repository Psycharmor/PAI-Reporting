import React from "react";

import {Card, CardBody, Row, Col} from "reactstrap";

export default function Brief(props) {
    return (
        <Card className={"briefing-card"}>
            <CardBody className={"briefing-card-body"}>
                <Row>
                    <Col>
                        <h3>{props["title"]}</h3>
                        <h2>{props["content"]}</h2>
                    </Col>
                    <Col xs={"auto"}>
                        <span className={"briefing-card-icon " + props["class"]}>
                            {props["icon"]}
                        </span>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};
