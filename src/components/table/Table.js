import React from 'react';

import {TablePagination} from "@material-ui/core";

import CourseTable from "./CourseTable";
import CourseUsersTable from "./CourseUsersTable";
import UserTable from "./UserTable";

class Table extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            count: 0,
            rowsPerPage: 10,
            page: 0,
            orderBy: "title",
            order: "asc"
        };
    }

    componentDidUpdate(prevProps) {

        // reset count if group changes
        if (prevProps.dashboardState.groupInfo !== this.props.dashboardState.groupInfo) {
            this.setState({
                count: this.getTableRowCount(),
                page: 0,
                orderBy: "title",
                order: "asc"
            });
        }

        else if (prevProps.dashboardState.currentWindow !== this.props.dashboardState.currentWindow) {
            this.setState({
                count: this.getTableRowCount(),
                page: 0
            });
        }
    }

    handlePageChange(e, newPage) {
        this.setState({
            page: newPage
        });
    }

    handleChangeRowsPerPage(newRowsPerPage) {
        this.setState({
            rowsPerPage: newRowsPerPage
        });
    }

    changeSorting(sortMethod) {
        if (sortMethod === this.state.orderBy) {
            this.setState({
                order: (this.state.order === "desc" ? "asc" : "desc")
            });
        }
        else {
            this.setState({
                orderBy: sortMethod,
                order: "asc"
            });
        }
    }

    render() {
        const table = this.getTable();

        return(
            <div className="dashboard-table">
                {table}
                <TablePagination
                    rowsPerPageOptions={[10, 20, 50]}
                    component="div"
                    count={this.state.count}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    onChangePage={(e, newPage) => this.handlePageChange(e, newPage)}
                    onChangeRowsPerPage={(e) => this.handleChangeRowsPerPage(e.target.value)}
                />
            </div>
        )
    }

    getTableRowCount() {
        switch (this.props.dashboardState.currentWindow) {
            case "groupSummary":
                return this.props.dashboardState.groupCourses.count;
            case "courseSummary":
                return this.props.dashboardState.groupUsers.count;
            case "userSummary":
                return this.props.dashboardState.groupCourses.count;
            default:
                return 0;
        }
    }

    getTable() {
        switch (this.props.dashboardState.currentWindow) {
            case "groupSummary":
                return(
                    <CourseTable
                        tableState={this.state}
                        courses={this.props.dashboardState.groupCourses}
                        activities={this.props.dashboardState.groupCourseActivities}
                        users={this.props.dashboardState.groupUsers}
                        sorting={(e) => this.sortJson(e)}
                        handleClick={this.props.handleCourseClick}
                        changeSorting={(e) => this.changeSorting(e)}
                        >
                    </CourseTable>
                );
            case "courseSummary":
                return(
                    <CourseUsersTable
                        tableState={this.state}
                        course={this.props.dashboardState.courseWindow}
                        activities={this.props.dashboardState.groupCourseActivities}
                        users={this.props.dashboardState.groupUsers}
                        sorting={(e) => this.sortJson(e)}
                        handleClick={this.props.handleUserClick}
                        changeSorting={(e) => this.changeSorting(e)}>
                    </CourseUsersTable>
                );
            case "userSummary":
                return(
                    <UserTable
                        tableState={this.state}
                        user={this.props.dashboardState.userWindow}
                        courses={this.props.dashboardState.groupCourses}
                        activities={this.props.dashboardState.groupCourseActivities}
                        users={this.props.dashboardState.groupUsers}
                        sorting={(e) => this.sortJson(e)}
                        handleClick={this.props.handleCourseClick}
                        changeSorting={(e) => this.changeSorting(e)}>
                    </UserTable>
                );
            default:
        }
    }

    sortJson(result) {
        let field = this.state.orderBy;

        function sortingMethod(a, b) {

            // need to check for string to do case-insensitive sorts
            let aField = a[field];
            let bField = b[field];
            if (typeof aField === "string") {
                aField = aField.toUpperCase();
            }
            if (typeof bField === "string") {
                bField = bField.toUpperCase();
            }

            if (aField === bField) {
                return 0;
            }
            else if (aField < bField) {
                return -1;
            }
            else { // aField > bField
                return 1;
            }
        }
        return (this.state.order === "asc" ? result.sort(function(a,b) {return sortingMethod(a,b)}) : result.sort(function(a,b) {return -sortingMethod(a,b)}) );
    }
}
export default Table;
