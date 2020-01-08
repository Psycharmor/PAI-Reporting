import React from "react";

import {Bar} from "react-chartjs-2";
import {Typography, Hidden} from "@material-ui/core";


const BeforeAfterBarGraph = (props) => {
    if (Object.keys(props["answerRates"]).length > 0) {
        let labels = props["questions"];
        let datasets = [
            {
                label: "1 - before",
                backgroundColor: "#FF5522",
                stack: "Stack 0",
                data: [0, 0, 0]
            },
            {
                label: "2 - before",
                backgroundColor: "#0176DD",
                stack: "Stack 0",
                data: [0, 0, 0]
            },
            {
                label: "3 - before",
                backgroundColor: "#FF54BC",
                stack: "Stack 0",
                data: [0, 0, 0]
            },
            {
                label: "4 - before",
                backgroundColor: "#FABE06",
                stack: "Stack 0",
                data: [0, 0, 0]
            },
            {
                label: "5 - before",
                backgroundColor: "#AA66E1",
                stack: "Stack 0",
                data: [0, 0, 0]
            },
            {
                label: "1 - now",
                backgroundColor: "#FF5522",
                stack: "Stack 1",
                data: [0, 0, 0]
            },
            {
                label: "2 - now",
                backgroundColor: "#0176DD",
                stack: "Stack 1",
                data: [0, 0, 0]
            },
            {
                label: "3 - now",
                backgroundColor: "#FF54BC",
                stack: "Stack 1",
                data: [0, 0, 0]
            },
            {
                label: "4 - now",
                backgroundColor: "#FABE06",
                stack: "Stack 1",
                data: [0, 0, 0]
            },
            {
                label: "5 - now",
                backgroundColor: "#AA66E1",
                stack: "Stack 1",
                data: [0, 0, 0]
            }
        ];

        if (props["portfolio"] === -1 && props["courseId"] === -1) {
            for (let portfolioKey in props["entries"]) {
                for (let courseKey in props["entries"][portfolioKey]["courses"]) {
                    for (let i = 0; i < labels.length; ++i) {
                        const question = labels[i];
                        let questionResult = props["answerRates"][courseKey][question]["before"];
                        for (let j = 0; j < questionResult.length; ++j) {
                            datasets[j]["data"][i] += questionResult[j];
                        }

                        questionResult = props["answerRates"][courseKey][question]["now"];
                        for (let j = 0; j < questionResult.length; ++j) {
                            datasets[j+5]["data"][i] += questionResult[j];
                        }
                    }
                }
            }
        }

        else {
            if (props["courseId"] === -1) {
                for (let courseKey in props["entries"][props["portfolio"]]["courses"]) {
                    for (let i = 0; i < labels.length; ++i) {
                        const question = labels[i];
                        let questionResult = props["answerRates"][courseKey][question]["before"];
                        for (let j = 0; j < questionResult.length; ++j) {
                            datasets[j]["data"][i] += questionResult[j];
                        }

                        questionResult = props["answerRates"][courseKey][question]["now"];
                        for (let j = 0; j < questionResult.length; ++j) {
                            datasets[j+5]["data"][i] += questionResult[j];
                        }
                    }
                }
            }

            else {
                for (let i = 0; i < labels.length; ++i) {
                    const question = labels[i];
                    let questionResult = props["answerRates"][props["courseId"]][question]["before"];
                    for (let j = 0; j < questionResult.length; ++j) {
                        datasets[j]["data"][i] += questionResult[j];
                    }

                    questionResult = props["answerRates"][props["courseId"]][question]["now"];
                    for (let j = 0; j < questionResult.length; ++j) {
                        datasets[j+5]["data"][i] += questionResult[j];
                    }
                }
            }
        }

        return (
            <div>
                <Hidden smUp implementation="css">
                    <Typography align={"center"} variant="subtitle2">{"Before and After"}</Typography>
                    <Bar
                        height={null} // https://github.com/jerairrest/react-chartjs-2/issues/368
                        width={null}
                        data={{
                            labels: labels,
                            datasets: datasets
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            aspectRatio: 1,
                            legend: {
                                display: false
                            },
                            scales: {
                                x: {
                                    stacked: true
                                },
                                y: {
                                    stacked: true,
                                }
                            }
                        }}
                    />
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Typography align={"center"} variant="subtitle2">{"Before and After"}</Typography>
                    <Bar
                        height={null} // https://github.com/jerairrest/react-chartjs-2/issues/368
                        width={null}
                        data={{
                            labels: labels,
                            datasets: datasets
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            aspectRatio: 2,
                            legend: {
                                display: false
                            },
                            scales: {
                                x: {
                                    stacked: true
                                },
                                y: {
                                    stacked: true,
                                }
                            }
                        }}
                    />
                </Hidden>
            </div>
        )
    }

    return (
        <div></div>
    );
};
export default BeforeAfterBarGraph;
