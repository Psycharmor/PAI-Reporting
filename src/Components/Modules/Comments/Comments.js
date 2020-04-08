import React from "react";

import {Container, Row, Col, TabContent, TabPane} from "reactstrap";

import AllTable from "./Tables/AllTable";
import PortfolioDropdown from "./PortfolioDropdown";
import CourseDropdown from "./CourseDropdown";

export default class Comments extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: "all",
            selectedRows: [],
            portfolioId: 0,
            courseId: 0,
            team: 0,
            org: 0,
            role: 0,
            startDate: new Date("2019/09/01"),
            endDate: new Date((new Date()).setHours(23, 59, 59, 999))
        };

        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
        this.handlePageAndSizeChange = this.handlePageAndSizeChange.bind(this);
        this.handlePortfolioChange = this.handlePortfolioChange.bind(this);
        this.handleCourseChange = this.handleCourseChange.bind(this);
        this.handleSingleRowSelect = this.handleSingleRowSelect.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.handleBulkAction = this.handleBulkAction.bind(this);
        this.handleApprove = this.handleApprove.bind(this);
        this.handlePending = this.handlePending.bind(this);
        this.handleTrash = this.handleTrash.bind(this);

        console.log("THIS", this);
    }

    /*
        Set the viewed tab to the new one defined by the event
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handleActiveTabChange(event) {
        this.setState({
            tab: event.target.getAttribute("value"),
            selectedRows: []
        });
    }

    handlePortfolioChange(event) {
        this.setState({
            portfolioId: parseInt(event.target["value"]),
            courseId: 0,
            selectedRows: []
        });
    }

    /*
        Set the courseId for the survey view so that you will only view results
        from that specific course
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handleCourseChange(event) {
        this.setState({
            courseId: event.target["value"],
            selectedRows: []
        });
    }

    handlePageAndSizeChange(event) {
        this.setState({
            selectedRows: []
        });
    }

    handleSingleRowSelect(row, isSelect, rowIndex, event) {
        let selectedRows = this.state["selectedRows"];
        if (isSelect) {
            selectedRows.push(row["id"]);
        }
        else {
            let index = selectedRows.indexOf(row["id"]);
            selectedRows.splice(index, 1);
        }
        this.setState({
            selectedRows: selectedRows
        });
    }

    handleSelectAll(isSelect, rows, event) {
        let selectedRows = [];
        if (isSelect) {
            for (let i = 0; i < rows.length; ++i) {
                selectedRows.push(rows[i]["id"]);
            }
        }
        this.setState({
            selectedRows: selectedRows
        });
    }

    /*
        Do action in bulk for the comments
        Params:
            event -> (Event) the event that was triggered
        Return:
            undefined
    */
    handleBulkAction(event) {
        const body = {
            action: event.currentTarget.getAttribute("value"),
            commentIds: this.state["selectedRows"]
        };
        this.setState({
            selectedRows: []
        });
        this.props["actionHandler"](body);
    }

    handleApprove(event) {
        const body = {
            action: "approve",
            commentIds: [event.currentTarget.getAttribute("value")]
        };
        this.props["actionHandler"](body);
    }

    handlePending(event) {
        const body = {
            action: "hold",
            commentIds: [event.currentTarget.getAttribute("value")]
        };
        this.props["actionHandler"](body);
    }

    handleTrash(event) {
        const body = {
            action: "trash",
            commentIds: [event.currentTarget.getAttribute("value")]
        };
        this.props["actionHandler"](body);
    }

    /*
        Render the tabs to display different content
        Params:
            none
        Return:
            JSX -> The elements to render onto the browser
    */
    renderTabs() {
        // return (
        //     <Nav tabs className={"survey-tabs"}>
        //         <NavItem
        //             className={(this.state["tab"] === "all") ? "active" : ""}
        //             onClick={this.handleActiveTabChange}
        //             value={"all"}
        //         >
        //             {"All"}
        //         </NavItem>
        //         <NavItem
        //             className={(this.state["tab"] === "pending") ? "active" : ""}
        //             onClick={this.handleActiveTabChange}
        //             value={"pending"}
        //         >
        //             {"Pending"}
        //         </NavItem>
        //         <NavItem
        //             className={(this.state["tab"] === "approve") ? "active" : ""}
        //             onClick={this.handleActiveTabChange}
        //             value={"approve"}
        //         >
        //             {"Approved"}
        //         </NavItem>
        //         <NavItem
        //             className={(this.state["tab"] === "trash") ? "active" : ""}
        //             onClick={this.handleActiveTabChange}
        //             value={"trash"}
        //         >
        //             {"Trashed"}
        //         </NavItem>
        //     </Nav>
        // );
    }

    /*
        Render the main content which will be the table
        Params:
            none
        Return:
            JSX -> The elements to render onto the browser
    */
    renderMainContent() {
        return (
            <TabContent activeTab={this.state["tab"]}>
                <TabPane tabId={"all"}>
                    <AllTable
                        comments={this.props["comments"]}
                        selectedRows={this.state["selectedRows"]}
                        portfolioId={this.state["portfolioId"]}
                        courseId={this.state["courseId"]}
                        singleRowSelectHandler={this.handleSingleRowSelect}
                        selectAllHandler={this.handleSelectAll}
                        pageAndSizeChangeHandler={this.handlePageAndSizeChange}
                        bulkActionHandler={this.handleBulkAction}
                        approveActionHandler={this.handleApprove}
                        pendingActionHandler={this.handlePending}
                        trashActionHandler={this.handleTrash}
                    />
                </TabPane>
            </TabContent>
        );
    }

    render() {
        const portfolioDropdown = (
            <PortfolioDropdown
                comments={this.props["comments"]}
                portfolioId={this.state["portfolioId"]}
                eventHandler={this.handlePortfolioChange}
            />
        );
        let courseDropdown;
        if (this.state["portfolioId"] !== 0) {
            courseDropdown = (
                <CourseDropdown
                    comments={this.props["comments"]}
                    portfolioId={this.state["portfolioId"]}
                    courseId={this.state["courseId"]}
                    eventHandler={this.handleCourseChange}
                />
            );
        }

        return (
            <Container fluid={true}>
                <Row>
                    <Col xs={3}>
                        {portfolioDropdown}
                    </Col>
                    <Col xs={3}>
                        {courseDropdown}
                    </Col>
                </Row>
                {this.renderMainContent()}
            </Container>
        );
    }
};
