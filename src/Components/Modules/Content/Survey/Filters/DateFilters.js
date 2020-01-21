import React from "react";

import {Col} from "reactstrap";
import Datetime from "react-datetime";

export default function DateFilters(props) {
    return (
        <>
            <Col xs={3}>
                <Datetime
                    value={props["startDate"]}
                    timeFormat={false}
                    isValidDate={(current) => {
                        return current.isBefore(props["endDate"]);
                    }}
                    onChange={props["startDateHandler"]}
                />
            </Col>
            <Col xs={3}>
                <Datetime
                    value={props["endDate"]}
                    timeFormat={false}
                    isValidDate={(current) => {
                        return current.isAfter(props["startDate"]);
                    }}
                    onChange={props["endDateHandler"]}
                />
            </Col>
        </>
    )
};
