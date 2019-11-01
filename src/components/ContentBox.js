import React from "react";

import {Paper, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    box: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: 200,
        height: 200,
        margin: "0 auto"
    }
}));

const ContentBox = (props) => {
    const classes = useStyles();
    return (
        <Paper className={classes["box"]}>
            <Typography variant="h5" align="center">
                {props["label"]}
            </Typography>
            <Typography variant="h5" align="center">
                {props["value"]}
            </Typography>
        </Paper>
    );
};
export default ContentBox;
