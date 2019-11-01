import React from "react";

import Drawer from "@material-ui/core/Drawer";
import {List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";

const NavBar = (props) => {
    const classes = props["styles"];

    let drawerItems = [];
    for (let i = 0; i < Object.keys(props["menus"]).length; ++i) {
        const menu = Object.keys(props["menus"])[i];
        const selected = (menu === props["view"] ? true : false);
        drawerItems.push(
            <ListItem button key={i} onClick={(e) => props["viewChangeHandler"](menu)} selected={selected}>
                <ListItemIcon>{props["menus"][menu]["icon"]}</ListItemIcon>
                <ListItemText primary={props["menus"][menu]["text"]}/>
            </ListItem>
        );
    }

    return (
        <Drawer
            variant={props["variant"]}
            open={props["open"]}
            onClose={props["handler"]}
            classes={{
                paper: classes["drawerPaper"]
            }}
        >
            <div className={classes["toolbar"]}/>
            <List className={classes["list"]}>
                {drawerItems}
            </List>
        </Drawer>
    );
};
export default NavBar;
