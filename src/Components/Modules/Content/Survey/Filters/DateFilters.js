import React from "react";

import {Col, Card, CardHeader} from "reactstrap";
import Datetime from "react-datetime";
import {IoMdCalendar} from "react-icons/io";

export default function DateFilters(props) {
    return (
        <>
            <Col sm={6}>
                <Card className={"filter-card"}>
                    <CardHeader className={"date-card-header"}>
                        <IoMdCalendar/>
                        <h5>{"Start Date"}</h5>
                    </CardHeader>
                    <Datetime
                        inputProps={{
                            placeholder: "mm/dd/yyyy"
                        }}
                        className={"pa-date"}
                        value={props["startDate"]}
                        timeFormat={false}
                        isValidDate={(current) => {
                            return current.isBefore(props["endDate"]);
                        }}
                        onChange={props["startDateHandler"]}
                    />
                </Card>
            </Col>
            <Col sm={6}>
                <Card className={"filter-card"}>
                    <CardHeader className={"date-card-header"}>
                        <IoMdCalendar/>
                        <h5>{"End Date"}</h5>
                    </CardHeader>
                    <Datetime
                        inputProps={{
                            placeholder: "mm/dd/yyyy"
                        }}
                        className={"pa-date"}
                        value={props["endDate"]}
                        timeFormat={false}
                        isValidDate={(current) => {
                            return current.isAfter(props["startDate"]);
                        }}
                        onChange={props["endDateHandler"]}
                    />
                </Card>
            </Col>
        </>
    )
};
