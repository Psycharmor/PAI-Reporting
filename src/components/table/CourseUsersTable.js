import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

class CourseUsersTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tableData: [],
            orderBy: "",
            order: "asc"
        };

        this.currentData = {
            course: {},
            users: {},
            activities: {}
        }
    }

    componentDidMount() {
        this.currentData = {
            course: this.props.course,
            users: this.props.users,
            activities: this.props.activities
        };
        this.setState({
            tableData: this.getTableData(this.currentData.users, this.currentData.course, this.currentData.activities)
        });
    }

    componentDidUpdate(prevProps) {
        if (this.groupChanged(prevProps)) {
            this.currentData = {
                course: this.props.course,
                users: this.props.users,
                activities: this.props.activities
            };
            this.setState({
                tableData: this.getTableData(this.currentData.users, this.currentData.course, this.currentData.activities),
                orderBy: "",
                order: "asc"
            });
        }
    }

    handleSortingOrderChange(column) {
        if (column === this.state.orderBy) {
            this.setState({
                order: (this.state.order === "desc" ? "asc" : "desc")
            });
        }
        else {
            this.setState({
                orderBy: column,
                order: "asc"
            });
        }
    }

    render() {
        const tableLabels = this.renderTableLabels(this.currentData.users);
        const tableBody = this.renderTableBody(this.state.tableData, this.currentData.users);

        return(
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
        )
    }

    /* render functions */

    renderTableLabels(users) {
        if (Object.keys(users).length === 0) {
            return [];
        }
        users = users.result;
        const labels = [
            {label: "User", orderBy: "username"},
            {label: "Progress %", orderBy: "percent"},
            {label: "Started", orderBy: "startedDate"},
            {label: "Completed", orderBy: "completedDate"}
        ];

        return labels.map((item, key) => {
            return(
                <TableCell key={key}>
                    <TableSortLabel
                        active={this.state.orderBy === item.orderBy}
                        direction={this.state.order}
                        onClick={() => this.handleSortingOrderChange(item.orderBy)}
                    >
                        {item.label}
                    </TableSortLabel>
                </TableCell>
            );
        });
    }

    renderTableBody(tableData, users) {
        if (tableData.length === 0) {
            return [];
        }

        return this.sortTable(tableData)
               .slice(this.props.tableState.page * this.props.tableState.rowsPerPage, this.props.tableState.page * this.props.tableState.rowsPerPage + this.props.tableState.rowsPerPage)
               .map((item, key) => {
                   const percent = (item["courseCompletions"].percent).toFixed(2);
                   const started = (item["courseCompletions"].startedDate === -1 ? "not recorded" : this.convertUnixTimestampToFormattedDate(item["courseCompletions"].startedDate));
                   const completed = (item["courseCompletions"].completedDate === -1 ? "not recorded" : this.convertUnixTimestampToFormattedDate(item["courseCompletions"].completedDate));

                   return(
                       <TableRow key={key} onClick={() => this.props.handleClick(item.user)}>
                            <TableCell>{item.username}</TableCell>
                            <TableCell>{+percent}%</TableCell>
                            <TableCell>{started}</TableCell>
                            <TableCell>{completed}</TableCell>
                       </TableRow>
                   );
               });
    }

    /* utility functions */

    groupChanged(prevProps) {
        return (prevProps.users !== this.currentData.users ||
            prevProps.activities !== this.currentData.activities);
    }

    getTableData(users, course, activities) {
        if (Object.keys(users).length === 0 && Object.keys(activities).length === 0) {
            return [];
        }

        users = users.result;
        activities = activities.result;

        let tableData = [];
        let userData = {};
        for (let i in users) {
            tableData[users[i].id] = {
                user: users[i],
                username: users[i].username,
                courseCompletions: {
                    percent: 0,
                    startedDate: -1,
                    completedDate: -1
                }
            };
        }
        for (let i in activities) {
            const activity = activities[i];
            if (activity["courseId"] === course.id) {
                tableData[activity["userId"]]["courseCompletions"]["percent"] = activity["stepsCompleted"] / activity["stepsTotal"] * 100;
                tableData[activity["userId"]]["courseCompletions"]["startedDate"] = activity["started"];
                tableData[activity["userId"]]["courseCompletions"]["completedDate"] = activity["completed"];
            }
        }

        return Object.values(tableData);
    }

    sortTable(tableData) {
        let field = this.state.orderBy;
        if (!field) {
            return tableData;
        }

        function sortMethod(a, b) {
            // need to check for string to do case-insensitive sorts
            let aField = a[field];
            let bField = b[field];

            if (!(field in a) && !(field in b)) {
                aField = a["courseCompletions"][field];
                bField = b["courseCompletions"][field];
            }

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
        return (this.state.order === "asc" ? tableData.sort(function(a,b) {return sortMethod(a,b)}) : tableData.sort(function(a,b) {return -sortMethod(a,b)}) );

    }

    convertUnixTimestampToFormattedDate(timestamp) {
        const date = new Date(timestamp * 1000); // need to convert secs -> milisecs
        const dateOptions = {
            month: "short",
            day: "2-digit",
            year: "numeric"
        };

        return date.toLocaleDateString("en-us", dateOptions);
    }
}
export default CourseUsersTable;
