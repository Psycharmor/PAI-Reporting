import React from "react";

import {AppBar, Toolbar, IconButton, Typography, Button} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const TopBar = (props) => {
    const classes = props["styles"];

    return (
        <AppBar position="fixed" className={classes["appBar"]}>
            <Toolbar>
                <IconButton
                    className={classes["menuButton"]}
                    color="inherit"
                    edge="start"
                    onClick={props["handler"]}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" className={classes["title"]}>
                    {props["label"]}
                </Typography>
                <Button
                    color="inherit"
                    onClick={props["logOutHandler"]}
                >
                    Log Out
                </Button>
            </Toolbar>
        </AppBar>
    );
}
export default TopBar;
