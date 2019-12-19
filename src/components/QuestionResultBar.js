import React from "react";

import {Typography, Box, LinearProgress} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    bar: {
        height: "10px"
    },
    colorPrimary: {
        backgroundColor: "#FF0000"
    },
    barColorPrimary: {
        backgroundColor: "##0000FF"
    },
    yes: {
        float: "left"
    },
    no: {
        float: "right"
    }
}));

const QuestionResultBar = (props) => {
    const classes = useStyles();
    let yes = 0;
    let no = 0;

    if (Object.keys(props["answerRates"]).length !== 0) {
        if (props["portfolio"] === -1) {
            if (props["courseId"] === -1) {
                for (let portfolioKey in props["entries"]) {
                    for (let courseKey in props["entries"][portfolioKey]["courses"]) {
                        yes += props["answerRates"][courseKey][props["question"]]["yes"];
                        no += props["answerRates"][courseKey][props["question"]]["no"];
                    }
                }
            }
        }
        else {
            if (props["courseId"] === -1) {
                for (let courseKey in props["entries"][props["portfolio"]]["courses"]) {
                    yes += props["answerRates"][courseKey][props["question"]]["yes"];
                    no += props["answerRates"][courseKey][props["question"]]["no"];
                }
            }
            else {
                yes += props["answerRates"][props["courseId"]][props["question"]]["yes"];
                no += props["answerRates"][props["courseId"]][props["question"]]["no"];
            }
        }
    }
    let title;
    let progress;
    let yesLabel;
    let noLabel;
    if (yes !== 0 || no !== 0) {
        title = <Typography variant="h6">{props["question"]}</Typography>;
        progress = <LinearProgress className={classes["bar"]} classes={{colorPrimary: classes["colorPrimary"], barColorPrimary: classes["barColorPrimary"]}} variant="determinate" value={yes / (yes + no) * 100}/>;

        const yesPercent = +((yes / (yes + no) * 100).toFixed(2));
        const noPercent = +((no / (yes + no) * 100).toFixed(2));
        yesLabel = <Typography variant="body1">{"Yes: " + yes + " (" + yesPercent + "%)"}</Typography>;
        noLabel = <Typography variant="body1">{"No: " + no + " (" + noPercent + "%)"}</Typography>;
    }

    return(
        <div className={"question-result-bar"}>
            {title}
            {progress}
            <Box display="flex" justifyContent="space-between">
                {yesLabel}
                {noLabel}
            </Box>
        </div>
    );
}
export default QuestionResultBar;
