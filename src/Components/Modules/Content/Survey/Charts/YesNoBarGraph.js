import React from "react";

import {Card, CardHeader, CardBody} from "reactstrap";
import {HorizontalBar} from "react-chartjs-2";

/*
    Component computes the data for the bar graph then renders the Yes/No Bar Graph
*/
export default function YesNoBarGraph(props) {
    const labels = props["questions"];
    const datasets = createDatasets(
        props["results"], labels, props["portfolioId"], props["courseId"]);
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
                    fontFamily: "open sans, sans-serif"
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
            barThickness: 10,
            stack: "Stack 0",
            data: [0, 0, 0, 0, 0]
        },
        {
            label: "No",
            backgroundColor: "#dc3545",
            barThickness: 10,
            stack: "Stack 0",
            data: [0, 0, 0, 0, 0]
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
