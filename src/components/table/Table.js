import React from 'react';

import {makeStyles} from "@material-ui/core/styles";
import {TablePagination, Container} from "@material-ui/core";

import CourseTable from "./CourseTable";
import CourseUsersTable from "./CourseUsersTable";
import UserTable from "./UserTable";

class Table extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            count: 0,
            rowsPerPage: 10,
            page: 0
        };
    }

    componentDidUpdate(prevProps) {

        // reset count if group changes
        if (prevProps.dashboardState.groupInfo !== this.props.dashboardState.groupInfo) {
            this.setState({
                count: this.getTableRowCount(),
                page: 0
            });
        }

        else if (prevProps.dashboardState.currentView !== this.props.dashboardState.currentView) {
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

    render() {
        const table = this.getTable();

        return(
            <Container>
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
            </Container>
        )
    }

    getTableRowCount() {
        switch (this.props.dashboardState.currentView) {
            case "groupView":
                return this.props.dashboardState.groupUsers.count;
            case "courseView":
                return this.props.dashboardState.groupUsers.count;
            case "userView":
                return this.props.dashboardState.groupCourses.count;
            default:
                return 0;
        }
    }

    getTable() {
        switch (this.props.dashboardState.currentView) {
            case "groupView":
                return(
                    <CourseTable
                        tableState={this.state}
                        courses={this.props.dashboardState.groupCourses}
                        activities={this.props.dashboardState.groupCourseActivities}
                        users={this.props.dashboardState.groupUsers}
                        handleClick={this.props.handleUserClick}
                        >
                    </CourseTable>
                );
            case "courseView":
                return(
                    <CourseUsersTable
                        tableState={this.state}
                        course={this.props.dashboardState.courseView}
                        activities={this.props.dashboardState.groupCourseActivities}
                        users={this.props.dashboardState.groupUsers}
                        handleClick={this.props.handleUserClick}
                        >
                    </CourseUsersTable>
                );
            case "userView":
                return(
                    <UserTable
                        tableState={this.state}
                        user={this.props.dashboardState.userView}
                        courses={this.props.dashboardState.groupCourses}
                        activities={this.props.dashboardState.groupCourseActivities}
                        handleClick={this.props.handleCourseClick}
                        >
                    </UserTable>
                );
            default:
        }
    }
}
export default Table;
