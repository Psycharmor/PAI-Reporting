import React, { Component } from 'react';

class TableEntry extends Component {

    constructor(props) {
        super(props);
        this.state = {
            opened: false
        }

        this.completed = "no";
        if (this.props.activity.activity.completed === 1) {
            this.completed = "yes";
        }
    }

    toggleEntry() {
        this.setState({
            opened: !this.state.opened
        });
    }

    render() {
        return(
            <li className="table-entry">
                <div className={this.state.opened ? "table-entry-header active" : "table-entry-header"}
                    onClick={() => {this.toggleEntry()}}
                >
                    <div>{this.props.activity.first_name} {this.props.activity.last_name}</div>
                    <div>{this.props.activity.activity.id}</div>
                    <div>{this.completed}</div>
                </div>
                <div className={this.state.opened ? "table-entry-content active" : "table-entry-content"}>
                    <div>Course Started: {this.props.activity.activity.timestamps_formatted.started}</div>
                    <div>{this.props.activity.activity.id}</div>
                    <div>{this.completed}</div>
                </div>
            </li>
        );
    }
}
export default TableEntry;
