import React, { Component } from 'react';

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";

class CourseTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rowsPerPage: 10,
            page: 0,
            count: 0,
            orderBy: "title",
            order: "asc"
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.courses !== prevProps.courses) {
            this.setState({
                page: 0,
                count: this.props.courses.count,
                orderBy: "title",
                order: "asc"
            });
        }
    }

    handleChangePage(e, newPage) {
        this.setState({
            page: newPage
        });
    }

    handleChangeRowsPerPage(e) {
        this.setState({
            rowsPerPage: e.target.value
        });
    }

    changeSorting(e, sortMethod) {
        if (sortMethod === this.state.orderBy) {
            this.setState({
                order: (this.state.order === "desc" ? "asc" : "desc")
            });
            console.log(this.state.order);
        }
        else {
            this.setState({
                orderBy: sortMethod,
                order: "asc"
            });
        }
    }

    sortJson(json) {
        let result = json.result;
        const field = this.state.orderBy;
        function sortingMethod(a, b) {
            if (a[field] === b[field]) {
                return 0;
            }
            else if (a[field] < b[field]) {
                return -1;
            }
            else { // a[field] > b[field]
                return 1;
            }
        }
        return (this.state.order === "asc" ? result.sort(function(a,b) {return sortingMethod(a,b)}) : result.sort(function(a,b) {return -sortingMethod(a,b)}) );
    }

    render() {
        let courses;
        if (Object.keys(this.props.courses).length > 0 && Object.keys(this.props.activities).length > 0 && Object.keys(this.props.users).length > 0) {
            courses = this.sortJson(this.props.courses)
            .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
            .map((item, key) => {
                const courseInfo = this.getCourseInfo(item.id, this.props.users.count);
                return (<TableRow key={key} onClick={() => this.props.handleClick(item)}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{courseInfo.notStarted}</TableCell>
                    <TableCell>{courseInfo.inProgress}</TableCell>
                    <TableCell>{courseInfo.completed}</TableCell>
                    <TableCell>{(courseInfo.completed / this.props.users.count) * 100}%</TableCell>
                </TableRow>);
            });
        }

        return(
            <div className="dashboard-table">
                <div>
                    <h3>Course Progress</h3>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={this.state.orderBy === "title"}
                                        direction={this.state.order}
                                        onClick={(e) => this.changeSorting(e, "title")}
                                    >
                                    Course
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Not Started</TableCell>
                                <TableCell>In Progress</TableCell>
                                <TableCell>Completed</TableCell>
                                <TableCell>% Complete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[10, 20, 50]}
                    component="div"
                    count={this.state.count}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    onChangePage={(e, newPage) => this.handleChangePage(e, newPage)}
                    onChangeRowsPerPage={(e) => this.handleChangeRowsPerPage(e)}
                />
            </div>
        );
    }

    getCourseInfo(courseId, userCount) {
        let notStarted = userCount;
        let inProgress = 0;
        let completed = 0;
        for (let activityIndex in this.props.activities.result) {
            const activity = this.props.activities.result[activityIndex];
            if (activity["courseId"] === courseId) {
                --notStarted;
                if (activity["stepsCompleted"] < activity["stepsTotal"]) {
                    ++inProgress;
                }
                if (activity["status"] === 1) {
                    ++completed;
                }
            }
        }

        return {
            notStarted: notStarted,
            inProgress: inProgress,
            completed: completed
        };
    }
}
export default CourseTable;
