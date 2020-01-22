import React from "react";

import {Navbar, Nav, NavItem} from "reactstrap";

export default function Sidebar(props) {
    const menuItems = getMenuItems(props["menus"], props["view"], props["viewChangeHandler"]);
    const displayResponsive = (props["responsiveOpen"]) ? "show" : "";
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

/*
    Create the components needed for an item on the sidebar.
    Params:
        menus               -> (object) All the menus to be added and their info
        currentView         -> (string) the current active view
        viewChangeHandler   -> (func) the event handler for changing view
    Return:
        array -> all the menu items in a rendered format
*/
function getMenuItems(menus, currentView, viewChangeHandler) {
    let menuItems = [];
    for (let view in menus) {
        let itemClassName = "menu-item";
        if (view === currentView) {
            itemClassName += " active";
        }
        menuItems.push(
            <NavItem
                key={view}
                value={view}
                className={itemClassName}
                onClick={viewChangeHandler}
            >
                <span className={"menu-icon " + menus[view]["class"]}>
                    {menus[view]["icon"]}
                </span>
                {menus[view]["text"]}
            </NavItem>
        );
    }

    return menuItems;
}
