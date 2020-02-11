import React from "react";

import {Button} from "reactstrap";
import {MdFilterList} from "react-icons/md";

import Filters from "./Filters";

export default class FilterBtn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showFilters: false
        };

        this.handleToggleFilters = this.handleToggleFilters.bind(this);
        this.handleHideFilters = this.handleHideFilters.bind(this);
    }

    handleToggleFilters(event) {
        this.setState({
            showFilters: !this.state["showFilters"]
        });
    }

    handleHideFilters(event) {
        this.setState({
            showFilters: false
        });
    }

    render() {
        return (
            <>
            {this.state["showFilters"] &&
            <div className={"filters-overlay"} onClick={this.handleHideFilters}/>}
            <Button
                color={"primary"}
                className={"btn pai-btn survey-filter-btn"}
                onClick={this.handleToggleFilters}
            >
                <MdFilterList/> {"Filters"}
            </Button>
            <Filters
                showFilters={this.state["showFilters"]}
                portfolios={this.props["portfolios"]}
                courses={this.props["courses"]}
                groups={this.props["groups"]}
                users={this.props["users"]}
                portfolioId={this.props["portfolioId"]}
                courseId={this.props["courseId"]}
                startDate={this.props["startDate"]}
                endDate={this.props["endDate"]}
                groupId={this.props["groupId"]}
                org={this.props["org"]}
                role={this.props["role"]}
                portfolioChangeHandler={this.props["portfolioChangeHandler"]}
                courseChangeHandler={this.props["courseChangeHandler"]}
                startDateChangeHandler={this.props["startDateChangeHandler"]}
                endDateChangeHandler={this.props["endDateChangeHandler"]}
                groupChangeHandler={this.props["groupChangeHandler"]}
                orgChangeHandler={this.props["orgChangeHandler"]}
                roleChangeHandler={this.props["roleChangeHandler"]}
            />
            </>
        );
    }
};
