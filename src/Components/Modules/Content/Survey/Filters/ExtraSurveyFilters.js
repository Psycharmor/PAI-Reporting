import React from "react";

import {Button, Row, Card} from "reactstrap";
import {MdFilterList} from "react-icons/md";

import DateFilters from "./DateFilters";
import UserFilters from "./UserFilters";

/*
    Adds additional filters to the survey other than the portfolio and
    the course
*/
class ExtraSurveyFilters extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showFilters: false
        };

        this.handleToggleFilters = this.handleToggleFilters.bind(this);
    }

    // Event Handler Methods

    /*
        show filters whenever an event triggers this handler
        Params:
            none
        Return:
            undefined
    */
    handleToggleFilters() {
        this.setState({
            showFilters: !this.state["showFilters"]
        });
    }

    render() {
        const show = (this.state["showFilters"]) ? "show" : "";
        return (
            <>
                <Button
                    color={"primary"}
                    className={"filter-btn"}
                    onClick={this.handleToggleFilters}
                >
                    <MdFilterList/> {"Filters"}
                </Button>
                <Card className={"filters-window " + show}>
                    <Row>
                        <DateFilters
                            startDate={this.props["startDate"]}
                            endDate={this.props["endDate"]}
                            startDateHandler={this.props["startDateHandler"]}
                            endDateHandler={this.props["endDateHandler"]}
                        />
                    </Row>
                    <UserFilters
                        surveyEntries={this.props["surveyEntries"]}
                        team={this.props["team"]}
                        organization={this.props["organization"]}
                        role={this.props["role"]}
                        teamHandler={this.props["teamHandler"]}
                        orgHandler={this.props["orgHandler"]}
                        roleHandler={this.props["roleHandler"]}
                    />
                </Card>
            </>
        );
    }
}
export default ExtraSurveyFilters;
