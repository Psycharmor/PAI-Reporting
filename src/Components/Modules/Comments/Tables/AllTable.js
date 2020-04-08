import React from "react";

import {Card, CardHeader, Nav, NavItem} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {FaCheck} from "react-icons/fa";

import BulkAction from "../BulkAction";

export default function AllTable(props) {
    const columns = [
        {
            text: "Email",
            dataField: "email",
            sort: true,
            headerStyle: headerStyle,
            style: cellStyle
        },
        {
            text: "Comment",
            dataField: "comment",
            sort: true,
            headerStyle: headerStyle,
            style: cellStyle,
            formatter: formatCommentColumn,
            formatExtraData: props
        },
        {
            text: "Status",
            dataField: "status",
            sort: true,
            headerStyle: headerStyle,
            style: cellStyle
        },
        {
            text: "Source Title",
            dataField: "title",
            sort: true,
            headerStyle: headerStyle,
            style: cellStyle
        }
    ];
    const data = getTableData(props);

    // console.log("data", data);

    const paginationOptions = {
        showTotal: true,
        alwaysShowAllBtns: true,
        sizePerPageList: [10, 50, 100, 200, 500],
        onPageChange: props["pageAndSizeChangeHandler"],
        onSizePerPageChange: props["pageAndSizeChangeHandler"]
    };
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

    return (
        <Card>
            <CardHeader>
                <h3>{"All Learner Comments"}</h3>
                <p>{"All the comments submitted by the learners"}</p>
                <BulkAction
                    bulkActionHandler={props["bulkActionHandler"]}
                />
            </CardHeader>
            <BootstrapTable
                bootstrap4={true}
                wrapperClasses={"table-responsive"}
                keyField={"id"}
                columns={columns}
                data={data}
                bordered={false}
                selectRow={selectRow}
                pagination={paginationFactory(paginationOptions)}
            />
        </Card>
    );
};

// Utility Functions
function formatCommentColumn(cell, row, rowIndex, formatExtraData) {
    return (
        <>
        {cell}<br/>
        <Nav>
            <NavItem onClick={formatExtraData["approveActionHandler"]} value={row["id"]} className={"comment-action"}>
                <span className={"approve"}>{"Approve"}</span>
            </NavItem>
            <NavItem onClick={formatExtraData["pendingActionHandler"]} value={row["id"]} className={"comment-action"}>
                <span className={"pending"}>{"Reset"}</span>
            </NavItem>
            <NavItem onClick={formatExtraData["trashActionHandler"]} value={row["id"]} className={"comment-action"}>
                <span className={"trash"}>{"Trash"}</span>
            </NavItem>
        </Nav>
        </>
    );
}

/*
    Get the table data that will show all the comments
    Params:
        props -> (object) the props passed to the component
    Return:
        array -> list of rows for the table
*/
function getTableData(props) {
    let data = [];



    for (let i in props["comments"] ){
    // for (let i = 0; i < props["comments"].length; ++i) {

        const comment = props["comments"][i];
        const status = getStatus(comment["status"]);



        if (props["portfolioId"] !== 0) {
            if (props["courseId"] !== 0) {
                if (comment["postTitle"] === props["courseId"]) {
                    data.push({
                        id: comment["ID"],
                        email: comment["email"],
                        comment: comment["comment"],
                        status: status,
                        title: comment["postTitle"]
                    });
                }
            }
            else if (typeof comment["portfolio"] === "object" && comment["portfolio"]["id"] === props["portfolioId"]) {
                data.push({
                    id: comment["ID"],
                    email: comment["email"],
                    comment: comment["comment"],
                    status: status,
                    title: comment["postTitle"]
                });
            }
        }
        else {
            data.push({
                id: comment["ID"],
                email: comment["email"],
                comment: comment["comment"],
                status: status,
                title: comment["postTitle"]
            });
        }
    }

    return data;
}

/*
    Get the comment status as a string
    Params:
        status -> (string) the status code
    Return:
        string -> the status of the comment
*/
function getStatus(status) {
    switch (status) {
        case "0":
            return "Pending";
        case "1":
            return "Approved";
        default:
            return status;
    }
}

// Table Styles
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
