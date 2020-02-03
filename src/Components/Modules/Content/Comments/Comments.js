import React from "react";

import {Container, Row, Col, Nav, NavItem, TabContent, TabPane} from "reactstrap";

class Comments extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: "all"
        };

        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
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
            tab: event.target.getAttribute("value")
        });
    }

    /*
        Render the tabs to display different content
        Params:
            none
        Return:
            JSX -> The elements to render onto the browser
    */
    renderTabs() {
        return (
            <Nav tabs className={"survey-tabs"}>
                <NavItem
                    className={(this.state["tab"] === "all") ? "active" : ""}
                    onClick={this.handleActiveTabChange}
                    value={"all"}
                >
                    {"All"}
                </NavItem>
                <NavItem
                    className={(this.state["tab"] === "pending") ? "active" : ""}
                    onClick={this.handleActiveTabChange}
                    value={"pending"}
                >
                    {"Pending"}
                </NavItem>
                <NavItem
                    className={(this.state["tab"] === "approve") ? "active" : ""}
                    onClick={this.handleActiveTabChange}
                    value={"approve"}
                >
                    {"Approved"}
                </NavItem>
                <NavItem
                    className={(this.state["tab"] === "trash") ? "active" : ""}
                    onClick={this.handleActiveTabChange}
                    value={"trash"}
                >
                    {"Trashed"}
                </NavItem>
            </Nav>
        );
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
                    
                </TabPane>
            </TabContent>
        );
    }

    render() {
        return (
            <Container fluid={true}>
                <Row>
                    <Col>
                        {this.renderTabs()}
                    </Col>
                </Row>
            </Container>
        );
    }
};
export default Comments;
