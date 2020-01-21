import React from "react";

import {Card, CardHeader, CardBody} from "reactstrap";
import {Pie} from "react-chartjs-2";

export default function FrqPieChart(props) {
    let labels, datasets;
    [labels, datasets] = createLabelDatasets(
        props["results"], props["question"], props["portfolioId"], props["courseId"]);
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            position: "right",
            labels: {
                boxWidth: 10,
                fontFamily: "open sans, sans-serif"
            }
        }
    };
    return (
        <Card>
            <CardHeader className={"survey-chart-header"}>
                <h6>{"Free Response"}</h6>
                <h3>{props["question"]}</h3>
            </CardHeader>
            <CardBody className={"survey-chart-body"}>
                <Pie
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
    Create the label and the datasets that will be sent to the Free Response
    pie chart
    Params:
        results      -> (object) the survey results
        question     -> (string) the question to search for
        pPortfolioId -> (int) the portfolioId from props
        pCourseId    -> (int) the courseId from props
    Return:
        array -> the data that will be sent to the pie chart
*/
function createLabelDatasets(results, question, pPortfolioId, pCourseId) {
    let tokenCount = {};
    if ((pPortfolioId === 0) && (pCourseId === 0)) {
        for (let portfolioId in results) {
            for (let courseId in results[portfolioId]) {
                getTokenCount(tokenCount, results, question, portfolioId, courseId);
            }
        }
    }
    else {
        if (pCourseId === 0) {
            for (let courseId in results[pPortfolioId]) {
                getTokenCount(tokenCount, results, question, pPortfolioId, courseId);
            }
        }
        else {
            getTokenCount(tokenCount, results, question, pPortfolioId, pCourseId);
        }
    }
    const topTokens = getTopTokens(tokenCount);
    let labels = [];
    let data = [];
    for (let i = 0; i < topTokens.length; ++i) {
        labels.push(topTokens[i]["token"]);
        data.push(topTokens[i]["count"]);
    }

    return [
        labels,
        [{
            data: data,
            backgroundColor: [
                "#5E72E4",
                "#11CDEF",
                "#2DCE89",
                "#FB6340",
                "#F5365C"
            ]
        }]
    ];
}

/*
    Get a total token count based on the filters given
    Params:
        tokenCount   -> (object) a list of tokens and their counts
        results      -> (object) the survey results
        question     -> (string) the question to search for
        pPortfolioId -> (int) the portfolioId from props
        pCourseId    -> (int) the courseId from props
    Return:
        undefined
*/
function getTokenCount(tokenCount, results, question, portfolioId, courseId) {
    const tokenCountForCourse = results[portfolioId][courseId][question];
    for (let token in tokenCountForCourse) {
        if (!(token in tokenCount)) {
            tokenCount[token] = 0;
        }
        tokenCount[token] += tokenCountForCourse[token];
    }
}

/*
    Get the top 5 tokens from the tokenCount object
    Params:
        tokenCount -> (object) a list of tokens and their counts
    Return:
        array -> the top 5 tokens and their counts
*/
function getTopTokens(tokenCount) {
    const topN = 5;
    let sortable = [];
    for (let token in tokenCount) {
        sortable.push({
            token: token,
            count: tokenCount[token]
        });
    }

    sortable.sort(function(a, b) {
        return b["count"] - a["count"];
    });
    return sortable.slice(0, topN);
}
