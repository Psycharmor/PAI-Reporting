import React from "react";

import {HorizontalBar} from "react-chartjs-2";
import {Typography} from "@material-ui/core";

const YesNoBarGraph = (props) => {
    if (Object.keys(props["answerRates"]).length > 0) {
        let labels = props["questions"];
        let datasets = [
            {
                label: "Yes",
                backgroundColor: "#0000FF",
                barThickness: 10,
                stack: "Stack 0",
                data: [0, 0, 0, 0, 0]
            },
            {
                label: "No",
                backgroundColor: "#FF0000",
                barThickness: 10,
                stack: "Stack 0",
                data: [0, 0, 0, 0, 0]
            }
        ];

        if (props["portfolio"] === -1 && props["courseId"] === -1) {
            for (let portfolioKey in props["entries"]) {
                for (let courseKey in props["entries"][portfolioKey]["courses"]) {
                    for (let i = 0; i < labels.length; ++i) {
                        const question = labels[i];
                        datasets[0]["data"][i] += props["answerRates"][courseKey][question]["yes"];
                        datasets[1]["data"][i] += props["answerRates"][courseKey][question]["no"];
                    }
                }
            }
        }

        else {
            if (props["courseId"] === -1) {
                for (let courseKey in props["entries"][props["portfolio"]]["courses"]) {
                    for (let i = 0; i < labels.length; ++i) {
                        const question = labels[i];
                        datasets[0]["data"][i] += props["answerRates"][courseKey][question]["yes"];
                        datasets[1]["data"][i] += props["answerRates"][courseKey][question]["no"];
                    }
                }
            }

            else {
                for (let i = 0; i < labels.length; ++i) {
                    const question = labels[i];
                    datasets[0]["data"][i] += props["answerRates"][props["courseId"]][question]["yes"];
                    datasets[1]["data"][i] += props["answerRates"][props["courseId"]][question]["no"];
                }
            }
        }

        return (
            <div>
                <Typography align={"center"} variant="subtitle2">{"Yes and No"}</Typography>
                <HorizontalBar
                    height={null} // https://github.com/jerairrest/react-chartjs-2/issues/368
                    width={null}
                    data={{
                        labels: labels,
                        datasets: datasets
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        aspectRatio: 3,
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
            </div>
        )
    }

    return (
        <div></div>
    )
}
export default YesNoBarGraph;
