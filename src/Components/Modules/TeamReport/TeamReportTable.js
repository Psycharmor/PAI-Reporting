import React from "react";

import {Card, CardHeader} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import TeamReportFunctions from "../../../Lib/Modules/TeamReport/TeamReportFunctions";

export default function TeamReportTable(props) {
    const group = props["groups"][props["groupId"]];
    const headers = TeamReportFunctions.getTableHeaders(group, props["courses"]);
    for (let i = 0; i < headers.length; ++i) {
        headers[i]["headerStyle"] = headerStyle;
        headers[i]["style"] = cellStyle;
    }
    const data = TeamReportFunctions.getTableData(group, props["users"], props["activities"]);;
    return (
        <Card className={"margin-bottom-50"}>
            <CardHeader>
                <h3>{"User Course Completions"}</h3>
                <p>{"All users and their course progress"}</p>
            </CardHeader>
            <BootstrapTable
                bootstrap4={true}
                wrapperClasses={"table-responsive"}
                keyField={"email"}
                columns={headers}
                data={data}
                bordered={false}
                pagination={paginationFactory({
                    showTotal: true,
                    alwaysShowAllBtns: true,
                    sizePerPageList: [10, 50, 100, 200, 500]
                })}
            />
        </Card>
    );
};

// table styles
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
    color: "#525F7F"
};
