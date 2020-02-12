import React from "react";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {FaCheck} from "react-icons/fa";
import moment from "moment";

import SurveyResultsFunctions from "../../../../Lib/Modules/SurveyResults/SurveyResultsFunctions";

export default function FrqTable(props) {
    const paginationOptions = {
        showTotal: true,
        alwaysShowAllBtns: true,
        sizePerPageList: [10, 50, 100, 200, 500],
        onPageChange: props["pagingHandler"],
        onSizePerPageChange: props["pagingHandler"]
    };
    const selectRow = {
        mode: "checkbox",
        headerColumnStyle: selectHeaderColumnStyle,
        selectColumnStyle: cellStyle,
        clickToSelect: true,
        selected: props["selected"],
        onSelect: props["singleRowSelectHandler"],
        onSelectAll: props["selectAllHandler"],
        selectionHeaderRenderer: renderCheckbox,
        selectionRenderer: renderCheckbox
    };
    return (
        <BootstrapTable
            bootstrap4={true}
            wrapperClasses={"table-responsive"}
            keyField={"index"}
            columns={getHead()}
            data={SurveyResultsFunctions.getFrqTableData(props)}
            bordered={false}
            selectRow={selectRow}
            pagination={paginationFactory(paginationOptions)}
        />
    );
};

function getHead() {
    return [
        {
            text: "Response",
            dataField: "response",
            headerStyle: headerStyle,
            style: cellStyle,
            sort: true
        },
        {
            text: "Categories",
            dataField: "categories",
            headerStyle: headerStyle,
            style: cellStyle,
            sort: true
        },
        {
            text: "Date Submitted",
            dataField: "submitted",
            headerStyle: headerStyle,
            style: cellStyle,
            sort: true,
            formatter: dateRenderer
        }
    ];
}

function renderCheckbox(selectProperties) {
    if (selectProperties["checked"]) {
        return (
            <div className={"pai-checkbox checked"}>
                <FaCheck className={"pai-checkmark"}/>
            </div>
        );
    }

    return (
        <div className={"pai-checkbox"}></div>
    );
}

function dateRenderer(cell, row, rowIndex, formatExtraData) {
    const date = moment.unix(row["submitted"]);
    return date.format("MMM DD YYYY");
}

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
