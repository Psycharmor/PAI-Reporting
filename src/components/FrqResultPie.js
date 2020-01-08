import React from "react";

import {Pie} from "react-chartjs-2";
import {Typography, Grid} from "@material-ui/core";

function getMostUsedTokens(tokenCount) {
    const topN = 5;
    let sortable = [];
    for (let token in tokenCount) {
        sortable.push([token, tokenCount[token]]);
    }

    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    return sortable.slice(0, topN);
}

const FrqResultPie = (props) => {
    if (Object.keys(props["answerRates"]).length !== 0) {
        let labels = [];
        let data = [];
        let tokenCount = {};
        if (props["portfolio"] === -1) {
            if (props["courseId"] === -1) {
                for (let portfolioKey in props["entries"]) {
                    for (let courseKey in props["entries"][portfolioKey]["courses"]) {
                        let tokenCountForCourse = props["answerRates"][courseKey][props["question"]];
                        for (let token in tokenCountForCourse) {
                            if (!(token in tokenCount)) {
                                tokenCount[token] = 0;
                            }
                            tokenCount[token] += tokenCountForCourse[token];
                        }
                    }
                }
            }
        }

        else {
            if (props["courseId"] === -1) {
                for (let courseKey in props["entries"][props["portfolio"]]["courses"]) {
                    let tokenCountForCourse = props["answerRates"][courseKey][props["question"]];
                    for (let token in tokenCountForCourse) {
                        if (!(token in tokenCount)) {
                            tokenCount[token] = 0;
                        }
                        tokenCount[token] += tokenCountForCourse[token];
                    }
                }
            }

            else {
                let tokenCountForCourse = props["answerRates"][props["courseId"]][props["question"]];
                for (let token in tokenCountForCourse) {
                    if (!(token in tokenCount)) {
                        tokenCount[token] = 0;
                    }
                    tokenCount[token] += tokenCountForCourse[token];
                }
            }
        }

        const topTokens = getMostUsedTokens(tokenCount);
        for (let i = 0; i < topTokens.length; ++i) {
            labels.push(topTokens[i][0]);
            data.push(topTokens[i][1]);
        }

        return (
            <Grid container direction={"column"} justify={"space-between"}>
                <Grid item xs>
                    <Typography align={"center"} variant="subtitle2">{props["question"]}</Typography>
                </Grid>
                <Grid item xs>
                    <Pie
                        height={null} // https://github.com/jerairrest/react-chartjs-2/issues/368
                        width={null}
                        data={{
                            labels: labels,
                            datasets: [{
                                data: data,
                                backgroundColor: [
                                    '#FE88BA',
                                    '#55DDED',
                                    '#FBD87A',
                                    "#99DD88",
                                    "#DEBBFF"
                                ],
                                hoverBackgroundColor: [
                                    '#FE88BA',
                                    '#55DDED',
                                    '#FBD87A',
                                    "#99DD88",
                                    "#DEBBFF"
                                ]
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            aspectRatio: 1.34,
                            legend: {
                                position: "right",
                                labels: {
                                    boxWidth: 10
                                }
                            }
                        }}
                    />
                </Grid>
            </Grid>
        );
    }

    return (
        <div></div>
    );
}
export default FrqResultPie;
