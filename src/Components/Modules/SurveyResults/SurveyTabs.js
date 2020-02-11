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
                className={(props["activeTab"] === "demographics") ? "active" : ""}
                onClick={props["activeTabChangeHandler"]}
                value={"demographics"}
            >
                {"Demographics"}
            </NavItem>
            <NavItem
                className={(props["activeTab"] === "freeResponse") ? "active" : ""}
                onClick={props["activeTabChangeHandler"]}
                value={"freeResponse"}
            >
                {"Free Response"}
            </NavItem>
        </Nav>
    );
};
