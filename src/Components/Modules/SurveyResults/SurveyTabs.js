import React from "react";

import {Nav, NavItem} from "reactstrap";

export default function SurveyTabs(props) {
    return (
        <Nav tabs className={"tabs"}>
            <NavItem
                className={(props["activeTab"] === "results") ? "active" : ""}
                onClick={props["activeTabChangeHandler"]}
                value={"results"}
            >
                {"Results"}
            </NavItem>
            <NavItem
                className={(props["activeTab"] === "caregiver") ? "active" : ""}
                onClick={props["activeTabChangeHandler"]}
                value={"caregiver"}
            >
                {"Caregiver"}
            </NavItem>
            <NavItem
                className={(props["activeTab"] === "caregiver") ? "active" : ""}
                onClick={props["activeTabChangeHandler"]}
                value={"caregiver"}
            >
                {"Caregiver"}
            </NavItem>
        </Nav>
    );
};
