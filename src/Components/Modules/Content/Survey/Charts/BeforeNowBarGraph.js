import React from "react";

import {Card, CardHeader, CardBody} from "reactstrap";
import {Bar} from "react-chartjs-2";

export default function BeforeNowBarGraph(props) {
    const labels = props["questions"];
    const datasets = createDatasets(
        props["results"], labels, props["portfolioId"], props["courseId"]);
    const legend = {
        display: true,
        labels: {
            filter: (legendItem, data) => {
                return legendItem["datasetIndex"] < 5;
            },
            fontFamily: "open sans, sans-serif"
        },
        onClick: function(e, legendItem) {
            // based on the default behavior given https://www.chartjs.org/docs/latest/configuration/legend.html
            let index = legendItem["datasetIndex"];
            const ci = this.chart;
            let meta = ci.getDatasetMeta(index);
            meta["hidden"] = (meta["hidden"] === null) ? !ci["data"]["datasets"][index]["hidden"] : null;

            index = index + 5;
            meta = ci.getDatasetMeta(index);
            meta["hidden"] = (meta["hidden"] === null) ? !ci["data"]["datasets"][index]["hidden"] : null;

            ci.update();
        }
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: legend,
        scales: {
            xAxes: [{
                stacked: true,
                ticks: {
                    fontFamily: "open sans, sans-serif"
                },
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                stacked: true,
                ticks: {
                    fontFamily: "open sans, sans-serif"
                }
            }]
        }
    };

    return (
        <Card>
            <CardHeader className={"survey-chart-header"}>
                <h6>{"Survey Scale"}</h6>
                <h3>{"Before & Now"}</h3>
            </CardHeader>
            <CardBody className={"survey-chart-body"}>
                <Bar
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
            label: "1",
            backgroundColor: "#F5365C",
            barPercentage: 0.2,
            stack: "Stack 0",
            data: [0, 0, 0]
        },
        {
            label: "2",
            backgroundColor: "#FB6340",
            barPercentage: 0.2,
            stack: "Stack 0",
            data: [0, 0, 0]
        },
        {
            label: "3",
            backgroundColor: "#2DCE89",
            barPercentage: 0.2,
            stack: "Stack 0",
            data: [0, 0, 0]
        },
        {
            label: "4",
            backgroundColor: "#11CDEF",
            barPercentage: 0.2,
            stack: "Stack 0",
            data: [0, 0, 0]
        },
        {
            label: "5",
            backgroundColor: "#5E72E4",
            barPercentage: 0.2,
            stack: "Stack 0",
            data: [0, 0, 0]
        },
        {
            label: "1 - now",
            backgroundColor: "#F5365C",
            barPercentage: 0.2,
            stack: "Stack 1",
            data: [0, 0, 0]
        },
        {
            label: "2 - now",
            backgroundColor: "#FB6340",
            barPercentage: 0.2,
            stack: "Stack 1",
            data: [0, 0, 0]
        },
        {
            label: "3 - now",
            backgroundColor: "#2DCE89",
            barPercentage: 0.2,
            stack: "Stack 1",
            data: [0, 0, 0]
        },
        {
            label: "4 - now",
            backgroundColor: "#11CDEF",
            barPercentage: 0.2,
            stack: "Stack 1",
            data: [0, 0, 0]
        },
        {
            label: "5 - now",
            backgroundColor: "#5E72E4",
            barPercentage: 0.2,
            stack: "Stack 1",
            data: [0, 0, 0]
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
        let questionResult = results[portfolioId][courseId][question]["before"];
        for (let j = 0; j < questionResult.length; ++j) {
            datasets[j]["data"][i] += questionResult[j];
        }

        questionResult = results[portfolioId][courseId][question]["now"];
        for (let j = 0; j < questionResult.length; ++j) {
            datasets[j+5]["data"][i] += questionResult[j];
        }
    }
}
