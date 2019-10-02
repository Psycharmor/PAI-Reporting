import React, {Component} from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

class UserTable extends Component {

    render() {

        const tableLabels = this.renderTableLabels();
        const tableBody = this.renderTableBody();

        return(
            <div>
                <h3>User Progress</h3>
                <Table>
                    <TableHead>
                        <TableRow>
                            {tableLabels}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableBody}
                    </TableBody>
                </Table>
            </div>
        );
    }

    renderTableLabels() {
        const labels = [
            {label: "Course", orderBy: "title"},
            {label: "% Complete", orderBy: "completed"},
            {label: "Completion Date", orderBy: "date"}
        ];

        return labels.map((item, key) => {
            return(
                <TableCell key={key}>
                    <TableSortLabel
                        active={this.props.tableState.orderBy === item.orderBy}
                        direction={this.props.tableState.order}
                        onClick={() => this.props.changeSorting(item.orderBy)}
                    >
                    {item.label}
                    </TableSortLabel>
                </TableCell>
            );
        });
    }

    renderTableBody() {
        if (Object.keys(this.props.activities).length === 0 && Object.keys(this.props.courses).length === 0 && Object.keys(this.props.users).length === 0) {
                return [];
        }

        return this.props.sorting(this.combineCoursesAndActivities(this.props.courses, this.props.user))
               .slice(this.props.tableState.page * this.props.tableState.rowsPerPage, this.props.tableState.page * this.props.tableState.rowsPerPage + this.props.tableState.rowsPerPage)
               .map((item, key) => {
                   return(
                       <TableRow key={key} onClick={() => this.props.handleClick(item.course)}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.completed}</TableCell>
                            <TableCell>{item.date > 0 ? this.getFormattedDate(item.date) : "not recorded"}</TableCell>
                       </TableRow>
                   );
               });
    }

    combineCoursesAndActivities(courses, user) {
        let coursesAndActivitiesCombined = [];
        for (let i in courses.result) {
            let courseEntry = {
                course: courses.result[i],
                title: courses.result[i].title
            };
            const completionInfo = this.getCompletionInfo(courses.result[i].id, user.id);
            for (let key in completionInfo) {
                courseEntry[key] = completionInfo[key];
            }

            coursesAndActivitiesCombined.push(courseEntry);
        }

        return coursesAndActivitiesCombined;
    }

    getCompletionInfo(courseId, userId) {
        let percentComplete = 0;
        let dateComplete = 0;

        for (let activityIndex in this.props.activities.result) {
            const activity = this.props.activities.result[activityIndex];
            if (activity["courseId"] === courseId && activity["userId"] === userId) {
                if (activity["status"] === 1) {
                    if (activity["completed"]) {
                        dateComplete = activity["completed"];
                    }
                }

                percentComplete = activity["stepsCompleted"] / activity["stepsTotal"] * 100;
            }
        }

        return {
            completed: percentComplete,
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
