import React from "react";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {FaCheck} from "react-icons/fa";

export default function FrqTable(props) {
    const columns = [
        {
            text: "Response",
            dataField: "response",
            sort: true,
            headerStyle: headerStyle,
            style: cellStyle
        },
        {
            text: "Categories",
            dataField: "categories",
            sort: true,
            headerStyle: headerStyle,
            style: cellStyle
        },
        {
            text: "Date Submitted",
            dataField: "dateSubmitted",
            sort: true,
            sortFunc: dateComparator,
            headerStyle: headerStyle,
            style: cellStyle
        }
    ];
    const data = getTableData(
        props["results"], props["portfolioId"], props["courseId"], props["question"], props["responses"]);
    const selectRow = {
        mode: "checkbox",
        headerColumnStyle: selectHeaderColumnStyle,
        selectColumnStyle: cellStyle,
        clickToSelect: true,
        selected: props["selectedRows"],
        onSelect: props["singleRowSelectHandler"],
        onSelectAll: props["selectAllHandler"],
        selectionRenderer: renderCheckbox,
        selectionHeaderRenderer: renderCheckbox
    };
    const paginationOptions = {
        showTotal: true,
        alwaysShowAllBtns: true,
        sizePerPageList: [10, 50, 100, 200, 500],
        onPageChange: props["pageAndSizeChangeHandler"],
        onSizePerPageChange: props["pageAndSizeChangeHandler"]
    };

    return (
        <BootstrapTable
            bootstrap4={true}
            wrapperClasses={"table-responsive"}
            keyField={"index"}
            columns={columns}
            data={data}
            bordered={false}
            selectRow={selectRow}
            pagination={paginationFactory(paginationOptions)}
        />
    );
};

// Table Functions

/*
    Get the data that will be sent to the table
    Params:
        results      -> (object) all the survey results
        pPortfolioId -> (int) the portfolio id from props
        pCourseId    -> (int) the course id from props
        question     -> (string) used as a filter for responses to fetch
    Return:
        array -> the data that will be sent to the table
*/
function getTableData(results, pPortfolioId, pCourseId, question, responses) {
    let data = [];
    if ((pPortfolioId === 0) && (pCourseId === 0)) {
        for (let portfolioId in results) {
            for (let courseId in results[portfolioId]) {
                addToData(data, results, portfolioId, courseId, question, responses);
            }
        }
    }
    else {
        if (pCourseId === 0) {
            for (let courseId in results[pPortfolioId]) {
                addToData(data, results, pPortfolioId, courseId, question, responses);
            }
        }
        else {
            addToData(data, results, pPortfolioId, pCourseId, question, responses);
        }
    }

    return data;
}

/*
    Add a new row to the data for the table
    Params:
        data         -> (array) the data that will be sent to the table
        results      -> (object) all the survey results
        pPortfolioId -> (int) the portfolio id
        pCourseId    -> (int) the course id
        question     -> (string) used as a filter for responses to fetch
    Return:
        undefined
*/
function addToData(data, results, portfolioId, courseId, question, apiResponses) {
    const responses = results[portfolioId][courseId][question];
    for (let i = 0; i < responses.length; ++i) {
        let categories = [];
        for (let j = 0; j < apiResponses.length; ++j) {
            if (apiResponses[j]["response"] === responses[i]["response"] &&
                parseInt(apiResponses[j]["user_id"]) === responses[i]["userId"] &&
                parseInt(apiResponses[j]["date_submitted"]) === responses[i]["dateSubmitted"]) {
                    categories.push(apiResponses[j]["category"]);
                }
        }
        data.push({
            index: data.length,
            userId: responses[i]["userId"],
            response: responses[i]["response"],
            categories: categories.join(', '),
            dateSubmitted: responses[i]["dateSubmitted"]
        });
    }
}

/*
    Comparator for sorting the date submitted column
    Params:
        a     -> (int) the date
        b     -> (int) the other date
        order -> (string) in what the direction the sort will go (asc, desc)
    Return:
        int -> whether a should go before b or not
*/
function dateComparator(a, b, order) {
    const aValue = parseInt(a);
    const bValue = parseInt(b);

    return (order === "asc") ? bValue - aValue : aValue - bValue;
}

// Table Style
const headerStyle = {
    padding: "0.75rem 1.5rem",
    borderBottom: "1px solid #E9ECEF",
    verticalAlign: "top",
    backgroundColor: "#F6F9FC",
    color: "#292A2B",
    fontSize: "0.65rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    width: 210
};

const cellStyle = {
    padding: "1rem",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
    verticalAlign: "top",
    fontSize: "0.8125rem",
    borderTop: "1px solid #E9ECEF",
    backgroundColor: "#FFFFFF",
    color: "#525F7F",
    cursor: "pointer"
};

// Row Selection Style
const selectHeaderColumnStyle = {
    padding: "0.75rem 1.5rem",
    borderBottom: "1px solid #E9ECEF",
    verticalAlign: "top",
    backgroundColor: "#F6F9FC",
    color: "#292A2B",
    fontSize: "0.65rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    width: 5,
    cursor: "pointer"
};


/*
    Customize the render of the checkbox in the table
    Params:
        selectProperties -> (object) info about the checkmark
    Return:
        JSX -> the customized checkmark
*/
function renderCheckbox(selectProperties) {
    if (selectProperties["checked"]) {
        return (
            <div className={"pa-checkbox checked"}>
                <FaCheck className={"pa-checkmark"}/>
            </div>
        );
    }

    return (
        <div className={"pa-checkbox"}></div>
    );
}
