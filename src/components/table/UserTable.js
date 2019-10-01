import React, {Component} from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";

class UserTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rowsPerPage: 10,
            page: 0,
            count: 0
        };
    }

    componentDidMount() {
        this.setState({
            count: this.props.courses.count
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.courses !== prevProps.courses) {
            this.setState({
                page: 0,
                count: this.props.courses.count
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

    render() {
        let courses;
        if (Object.keys(this.props.activities).length > 0 && Object.keys(this.props.courses).length > 0 && Object.keys(this.props.users).length > 0) {
            courses = this.props.courses.result
            .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
            .map((item, key) => {
                const completionInfo = this.getCompletionInfo(item.id, this.props.user.id);
                return(
                    <TableRow key={key} onClick={() => this.props.handleClick(item)}>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{completionInfo.percent}</TableCell>
                        <TableCell>{completionInfo.date}</TableCell>
                    </TableRow>
                );
            });
        }

        return(
            <div className="dashboard-table">
                <div>
                    <h3>User Progress</h3>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Course</TableCell>
                                <TableCell>% Complete</TableCell>
                                <TableCell>Completion Date</TableCell>
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

    getCompletionInfo(courseId, userId) {
        let percentComplete = 0;
        let dateComplete = "";

        for (let activityIndex in this.props.activities.result) {
            const activity = this.props.activities.result[activityIndex];
            if (activity["courseId"] === courseId && activity["userId"] === userId) {
                if (activity["status"] === 1) {
                    if (!activity["completed"]) {
                        dateComplete = "not recorded";
                    }
                    else {
                        dateComplete = this.getFormattedDate(activity["completed"]);
                    }
                }

                percentComplete = activity["stepsCompleted"] / activity["stepsTotal"] * 100;
            }
        }

        return {
            percent: percentComplete,
            date: dateComplete
        };
    }

    getFormattedDate(unixTimeStamp) {
        let date = new Date(unixTimeStamp * 1000);
        date = [date.getFullYear(), date.getMonth()+1, date.getDate()];
        return date.join("-");
    }
}
export default UserTable;
