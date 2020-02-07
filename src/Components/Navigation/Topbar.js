import React from "react";

import {Navbar, Button} from "reactstrap";
import {FaBars} from "react-icons/fa";

export default function Topbar(props) {
    return (
        <div>
            <Navbar className={"topbar"}>
                <span className={"sidebar-toggle-btn"}>
                    <FaBars onClick={props["sidebarToggleHandler"]}/>
                </span>
                <Button className={"log-out-btn"} onClick={props["userLogoutHandler"]}>{"Log Out"}</Button>
            </Navbar>
            <div className={"header-bg"}/>
        </div>
    );
}
