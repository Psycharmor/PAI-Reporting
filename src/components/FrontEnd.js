import React from "react";

import {Hidden} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

import NavBar from "./NavBar";
import TopBar from "./TopBar";
import Content from "./Content";

/*
 *  Display all the content that will be shown to the user
 *  Ideally keep all components from here onward functional stateless components
 *  i.e. make it as dumb as possible doing very little processing at most
 */

// Define the styles that will be used.
const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    drawer: {
        [theme.breakpoints.up("sm")]: {
            width: drawerWidth,
            flexShrink: 0
        }
    },
    drawerPaper: {
        width: drawerWidth
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up("sm")]: {
            width: "calc(100% - " + drawerWidth + "px)"
        }
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    },
    title: {
        flexGrow: 1
    },
    toolbar: theme.mixins.toolbar,
    list: {
        padding: 0
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        overflowX: "hidden"
    }
}));

const FrontEnd = (props) => {

    const classes = useStyles();
    const label = props["menus"][props["view"]]["text"];

    return (
        /*
            Use the render components that handle the top bar, Side bar, and
            main content in that order.
        */
        <div className={classes["root"]}>
            <TopBar
                styles={classes}
                handler={props["mobileDrawerHandler"]}
                label={label}
                logOutHandler={props["logOutHandler"]}
            />
            <nav className={classes["drawer"]}>
                <Hidden smUp implementation="css">
                    <NavBar
                        styles={classes}
                        menus={props["menus"]}
                        view={props["view"]}
                        variant="temporary"
                        open={props["openDrawer"]}
                        handler={props["mobileDrawerHandler"]}
                        viewChangeHandler={props["viewChangeHandler"]}
                    />
                </Hidden>
                <Hidden xsDown implementation="css">
                    <NavBar
                        styles={classes}
                        menus={props["menus"]}
                        view={props["view"]}
                        variant="permanent"
                        open={true}
                        viewChangeHandler={props["viewChangeHandler"]}
                    />
                </Hidden>
            </nav>
            <Content
                styles={classes}
                menus={props["menus"]}
                view={props["view"]}
                groupChangeHandler={props["groupChangeHandler"]}
                groupId={props["groupId"]}
            />
        </div>
    )
}
export default FrontEnd;
