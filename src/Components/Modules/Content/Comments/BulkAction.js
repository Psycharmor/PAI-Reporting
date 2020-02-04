import React from "react";

import {Input, Button, Row, Col} from "reactstrap";

class BulkAction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            action: "approve"
        };

        this.handleDropdownChange = this.handleDropdownChange.bind(this);
    }

    handleDropdownChange(event) {
        this.setState({
            action: event.target["value"]
        });
    }

    renderDropdown() {
        const options = getOptions();
        return (
            <Input className={"team-report-dropdown"} type={"select"} value={this.state["action"]} onChange={this.handleDropdownChange}>
                {options}
            </Input>
        );
    }

    renderBtn() {
        return (
            <Button
                color={"primary"}
                onClick={this.props["bulkActionHandler"]}
                value={this.state["action"]}
            >
                {"Bulk Action"}
            </Button>
        );
    }

    render() {
        return (
            <Row>
                <Col className={"bulk-action"}>
                    {this.renderDropdown()}
                    {this.renderBtn()}
                </Col>
            </Row>
        );
    }
}
export default BulkAction;

function getOptions() {
    const pOptions = {
        approve: "Approve",
        hold: "Pending",
        trash: "Trash"
    };
    let options = [];

    for (let option in pOptions) {
        options.push(
            <option key={option} value={option}>{pOptions[option]}</option>
        );
    }

    return options;
}
