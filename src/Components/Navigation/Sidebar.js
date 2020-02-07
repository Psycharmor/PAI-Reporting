import React from "react";

import {Navbar, Nav, NavItem} from "reactstrap";

/*
    Renders the left sidebar that allows users to switch views/windows
*/
export default function Sidebar(props) {
    const menuItems = getMenuItems(props);
    const displayResponsive = (props["sidebarOpen"]) ? "show" : "";
    return (
        <>
        <Navbar className={"sidenav navbar-vertical"}>
            <Nav className={"navbar-nav"}>
                {menuItems}
            </Nav>
        </Navbar>
        <div>
            <div
                className={"sidebar-responsive-overlay " + displayResponsive}
                onClick={props["sidebarToggleHandler"]}
            />
            <Navbar className={"sidenav navbar-vertical responsive " + displayResponsive}>
                <Nav className={"navbar-nav"}>
                    {menuItems}
                </Nav>
            </Navbar>
        </div>
        </>
    );
}

// Utility Functions

function getMenuItems(props) {
    let menuItems = [];

    for (let view in props["menus"]) {
        let itemClassName = "menu-item";
        if (view === props["view"]) {
            itemClassName += " active";
        }
        menuItems.push(
            <NavItem
                key={view}
                value={view}
                className={itemClassName}
                onClick={props["viewChangeHandler"]}
            >
                <span className={"menu-icon " + props["menus"][view]["class"]}>
                    {props["menus"][view]["icon"]}
                </span>
                {props["menus"][view]["text"]}
            </NavItem>
        );
    }

    return menuItems;
}
