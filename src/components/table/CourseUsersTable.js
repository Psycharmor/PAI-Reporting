import React, { Component } from 'react';

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

class CourseUsersTable extends Component {

    render() {

        const tableLabels = this.renderTableLabels();
        const tableBody = this.renderTableBody();

        return(
            <div>
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
        let labels = [
            {label: "Display Name", orderBy: "username"},
            {label: "Email Address", orderBy: "email"},
            {label: "% Completed", orderBy: "completed"},
            {label: "Completion Date", orderBy: "date"}
        ];
        labels = labels.map((item, key) => {
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

        return labels;
    }

    renderTableBody() {
        if (Object.keys(this.props.activities).length === 0 && Object.keys(this.props.users).length === 0) {
                return [];
        }

        return this.props.sorting(this.combineUsersAndActivities(this.props.users, this.props.course))
               .slice(this.props.tableState.page * this.props.tableState.rowsPerPage, this.props.tableState.page * this.props.tableState.rowsPerPage + this.props.tableState.rowsPerPage)
               .map((item, key) => {
                   return(
                       <TableRow key={key} onClick={() => this.props.handleClick(item.user)}>
                           <TableCell>{item.username}</TableCell>
                           <TableCell>{item.email}</TableCell>
                           <TableCell>{+item.completed.toFixed(2)}%</TableCell>
                           <TableCell>{(item.date > 0 ? this.getFormattedDate(item.date) : "not recorded")}</TableCell>
                       </TableRow>
                   );
               });
    }

    combineUsersAndActivities(users, course) {
        let usersAndActivitiesCombined = [];
        for (let i in users.result) {
            let userEntry = {
                user: users.result[i],
                username: users.result[i].username,
                email: users.result[i].email
            };
            const completionInfo = this.getCompletionInfo(course.id, users.result[i].id);
            for (let key in completionInfo) {
                userEntry[key] = completionInfo[key];
            }

            usersAndActivitiesCombined.push(userEntry);
        }

        return usersAndActivitiesCombined;
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
        date = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
        return date.join("-");
    }
}
export default CourseUsersTable;
