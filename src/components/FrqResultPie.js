import React from "react";

import {Pie} from "react-chartjs-2";
import {Typography} from "@material-ui/core";

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
            <div>
                <Typography align={"center"} variant="h6">{props["question"]}</Typography>
                <Pie
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
                />
            </div>
        );
    }

    return (
        <div></div>
    );
}
export default FrqResultPie;
