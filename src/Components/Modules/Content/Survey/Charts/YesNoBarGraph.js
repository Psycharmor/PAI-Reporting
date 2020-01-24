import React from "react";

import {Card, CardHeader, CardBody} from "reactstrap";
import {HorizontalBar} from "react-chartjs-2";
import "chartjs-plugin-datalabels";

/*
    Component computes the data for the bar graph then renders the Yes/No Bar Graph
*/
export default function YesNoBarGraph(props) {
    const labels = props["questions"];
    const datasets = createDatasets(
        props["results"], labels, props["portfolioId"], props["courseId"]);
    const chartMax = getChartMax(getMaxTotalData(datasets));
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            labels: {
                fontFamily: "open sans, sans-serif"
            }
        },
        scales: {
            xAxes: [{
                stacked: true,
                ticks: {
                    fontFamily: "open sans, sans-serif",
                    suggestedMax: chartMax
                }
            }],
            yAxes: [{
                stacked: true,
                ticks: {
                    fontFamily: "open sans, sans-serif"
                },
                gridLines: {
                    display: false
                }
            }]
        },
        plugins: {
            datalabels: {
                color: "#000000",
                display: function(content) {
                    const datasetIndex = content["datasetIndex"];
                    if (datasetIndex === 0) {
                        return !content["chart"].isDatasetVisible(1);
                    }

                    return content["chart"].isDatasetVisible(1);

                },
                formatter: function(value, context) {
                    const dataIndex = context["dataIndex"];
                    const yesValue = datasets[0]["data"][dataIndex];
                    const noValue = datasets[1]["data"][dataIndex];
                    const total = yesValue + noValue;
                    if (total === 0) {
                        return "0% / 0%";
                    }
                    const yesPercent = (+(yesValue / total * 100).toFixed(2)) + "%";
                    const noPercent = (+(noValue / total * 100).toFixed(2)) + "%";
                    return yesPercent + " / " + noPercent;
                },
                font: {
                    family: "open sans, sans-serif",
                    weight: 600
                }
            }
        }
    };

    return (
        <Card>
            <CardHeader className={"survey-chart-header"}>
                <h6>{"Single Choice"}</h6>
                <h3>{"Yes & No"}</h3>
            </CardHeader>
            <CardBody className={"survey-chart-body"}>
                <HorizontalBar
                    height={null} // https://github.com/jerairrest/react-chartjs-2/issues/368
                    width={null}
                    data={{
                        labels: labels,
                        datasets: datasets
                    }}
                    options={options}
                />
            </CardBody>
        </Card>
    );
};

/*
    Create the datasets that will be sent to the bar graph filtered by the portfolio
    and the school
    Params:
        results      -> (object) the survey results
        labels       -> (array) all the questions
        pPortfolioId -> (int) the portfolioId from props
        pCourseId    -> (int) the courseId from props
    Return:
        array -> the data that will be sent to the bar graph
*/
function createDatasets(results, labels, pPortfolioId, pCourseId) {
    let datasets = [
        {
            label: "Yes",
            backgroundColor: "#5e72e4",
            barPercentage: 0.7,
            stack: "Stack 0",
            datalabels: {
                anchor: "end",
                align: "end"
            },
            data: [0, 0, 0, 0, 0, 0]
        },
        {
            label: "No",
            backgroundColor: "#dc3545",
            barPercentage: 0.7,
            stack: "Stack 0",
            datalabels: {
                anchor: "end",
                align: "end"
            },
            data: [0, 0, 0, 0, 0, 0]
        }
    ];

    if ((pPortfolioId === 0) && (pCourseId === 0)) {
        for (let portfolioId in results) {
            for (let courseId in results[portfolioId]) {
                getResultsData(datasets, results, labels, portfolioId, courseId);
            }
        }
    }
    else {
        if (pCourseId === 0) {
            for (let courseId in results[pPortfolioId]) {
                getResultsData(datasets, results, labels, pPortfolioId, courseId);
            }
        }
        else {
            getResultsData(datasets, results, labels, pPortfolioId, pCourseId);
        }
    }

    return datasets;
}

/*
    Get the data from results and add them to the datasets parameter
    Params:
        datasets     -> (array) the datasets to send to the bar graph
        results      -> (object) the survey results
        labels       -> (array) all the questions
        pPortfolioId -> (int) the portfolioId from props
        pCourseId    -> (int) the courseId from props
    Return:
        undefined
*/
function getResultsData(datasets, results, labels, portfolioId, courseId) {
    for (let i = 0; i < labels.length; ++i) {
        const question = labels[i];
        datasets[0]["data"][i] += results[portfolioId][courseId][question]["yes"];
        datasets[1]["data"][i] += results[portfolioId][courseId][question]["no"];
    }
}

/*
    Get the largest total of submissions out of all the questions
    Params:
        datasets -> (object) the dataset to be passed to the chart
    Return:
        int -> the max total number
*/
function getMaxTotalData(datasets) {
    let max = 0;
    const data = datasets[0]["data"];
    const otherData = datasets[1]["data"];
    for (let i = 0; i < data.length; ++i) {
        const dataMax = data[i] + otherData[i];
        if (dataMax > max) {
            max = dataMax;
        }
    }

    return max;
}

/*
    Get the maximum x value the chart will go up to
    Params:
        dataMax -> (int) the biggest total value out of all the questions
    Return:
        int -> the chart's x value
*/
function getChartMax(dataMax) {
    let placeValue = 1;
    for (let i = 0; i < dataMax.toString().length - 1; ++i) {
        placeValue *= 10;
    }

    return Math.ceil(dataMax / placeValue) * placeValue + placeValue;
}
