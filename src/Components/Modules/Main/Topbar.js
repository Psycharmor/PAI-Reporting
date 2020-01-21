import React from "react";

import {Navbar, Button} from "reactstrap";

export default function Topbar(props) {
    return (
        <div>
            <Navbar className={"topbar"}>
                <Button className={"log-out-btn"} onClick={props["userLogoutHandler"]}>{"Log Out"}</Button>
            </Navbar>
            <div className={"header-bg"}/>
        </div>
    );
}
