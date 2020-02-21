import React from "react";

import {Card, CardHeader} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import LoadingOverlay from "../../LoadingOverlay";
import TeamReportFunctions from "../../../Lib/Modules/TeamReport/TeamReportFunctions";

export default class TeamReportTable extends React.Component {
    constructor(props) {
        super(props);

        const group = this.props["groups"][this.props["groupId"]];
        this.state = {
            loading: true,
            headers: TeamReportFunctions.getTableHeaders(group, this.props["courses"]),
            data: []
        };
    }

    componentDidMount() {
        this.setState((state) => {
            return {
                loading: true,
                headers: [],
                data: []
            };
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps["groupId"] !== this.props["groupId"]) {
            this.setState((state) => {
                return {
                    loading: true,
                    headers: [],
                    data: []
                };
            });
        }

        else if (this.state["loading"]) {
            this.setTable();
        }
    }

    setTable() {
        const group = this.props["groups"][this.props["groupId"]];
        let headers = TeamReportFunctions.getTableHeaders(group, this.props["courses"]);
        for (let i = 0; i < headers.length; ++i) {
            headers[i]["headerStyle"] = headerStyle;
            headers[i]["style"] = cellStyle;
        }
        const data = TeamReportFunctions.getTableData(group, this.props["users"], this.props["activities"], this.props);
        this.setState((state) => {
            return {
                loading: false,
                headers: headers,
                data: data
            };
        });
    }

    render() {
        console.log(this.state);
        return (
            <>
            {this.state["loading"] && <LoadingOverlay/>}
            <Card className={"table-card"}>
                <CardHeader>
                    <h3>{"User Course Completions"}</h3>
                    <p>{"All users and their course progress"}</p>
                </CardHeader>
                <BootstrapTable
                    bootstrap4={true}
                    wrapperClasses={"table-responsive"}
                    keyField={"email"}
                    columns={this.state["headers"]}
                    data={this.state["data"]}
                    bordered={false}
                    pagination={paginationFactory({
                        showTotal: true,
                        alwaysShowAllBtns: true,
                        sizePerPageList: [10, 50, 100, 200, 500]
                    })}
                />
            </Card>
            </>
        );
    }
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
