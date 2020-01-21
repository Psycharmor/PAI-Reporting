import React from "react";

import {Card, CardHeader, CardBody} from "reactstrap";
import {Pie} from "react-chartjs-2";

export default function MultChoicePieChart(props) {
    const labels = [
        "Interested in topic",
        "To improve performance",
        "Directed to take this course",
        "To earn Continuing Education Credit or Equiv",
        "Other"
    ];
    const datasets = createDatasets(
        props["results"], props["question"], props["portfolioId"], props["courseId"]);
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            position: "right",
            labels: {
                fontFamily: "open sans, sans-serif"
            }
        }
    };

    return (
        <Card>
            <CardHeader className={"survey-chart-header"}>
                <h6>{"Multiple Choice"}</h6>
                <h3>{props["question"]}</h3>
            </CardHeader>
            <CardBody className={"survey-chart-body"}>
                <Pie
                    height={null}
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
    Create the datasets that will be sent to the pie chart filtered by the portfolio
    and the school
    Params:
        results      -> (object) the survey results
        question     -> (string) the question to search for
        pPortfolioId -> (int) the portfolioId from props
        pCourseId    -> (int) the courseId from props
    Return:
        array -> the data that will be sent to the pie chart
*/
function createDatasets(results, question, pPortfolioId, pCourseId) {
    let resultCount = {
        "Interested in topic": 0,
        "To improve performance": 0,
        "Directed to take this course": 0,
        "To earn Continuing Education Credit or Equiv": 0,
        "Other": 0
    };

    if ((pPortfolioId === 0) && (pCourseId === 0)) {
        for (let portfolioId in results) {
            for (let courseId in results[portfolioId]) {
                getResultsData(resultCount, results, question, portfolioId, courseId);
            }
        }
    }
    else {
        if (pCourseId === 0) {
            for (let courseId in results[pPortfolioId]) {
                getResultsData(resultCount, results, question, pPortfolioId, courseId);
            }
        }
        else {
            getResultsData(resultCount, results, question, pPortfolioId, pCourseId);
        }
    }

    return [{
        data: Object.values(resultCount),
        backgroundColor: [
            "#5e72e4",
            "#11cdef",
            "#2dce89",
            "#fb6340",
            "#f5365c"
        ]
    }];
}

/*
    Get the data from results and add them to the datasets parameter
    Params:
        resultCount  -> (object) the datasets to send to the bar graph
        results      -> (object) the survey results
        question     -> (string) the question to search for
        pPortfolioId -> (int) the portfolioId from props
        pCourseId    -> (int) the courseId from props
    Return:
        undefined
*/
function getResultsData(resultCount, results, question, portfolioId, courseId) {
    const questionResult = results[portfolioId][courseId][question];
    for (let option in questionResult) {
        resultCount[option] += questionResult[option];
    }
}
