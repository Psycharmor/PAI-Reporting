import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

class CourseTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tableData: [],
            orderBy: "",
            order: "asc"
        };

        this.currentData = {
            courses: {},
            users: {},
            activities: {}
        };
    }

    componentDidMount() {
        this.currentData = {
            courses: this.props.courses,
            users: this.props.users,
            activities: this.props.activities
        };
        this.setState({
            tableData: this.getTableData(this.currentData.users, this.currentData.courses, this.currentData.activities)
        });
    }

    componentDidUpdate(prevProps) {
        if (this.groupChanged(prevProps)) {
            this.currentData = {
                courses: this.props.courses,
                users: this.props.users,
                activities: this.props.activities
            };
            this.setState({
                tableData: this.getTableData(this.currentData.users, this.currentData.courses, this.currentData.activities),
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
            })
        }
    }

    render() {
        const tableLabels = this.renderTableLabels(this.currentData.courses);
        const tableBody = this.renderTableBody(this.state.tableData, this.currentData.courses);

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
        );
    }

    /* render functions */
    renderTableLabels(courses) {
        if (Object.keys(courses).length === 0) {
            return [];
        }
        courses = courses.result;
        let labels = [{label: "Username", orderBy: "username"}];
        for (let i in courses) {
            labels.push({label: courses[i].title, orderBy: courses[i].id});
        }

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

    renderTableBody(tableData, courses) {
        if (Object.keys(courses).length === 0) {
            return [];
        }
        courses = courses.result;
        let keys = [];
        for (let i in courses) {
            keys.push({label: courses[i].title, key: courses[i].id});
        }

        return this.sortTable(tableData)
               .slice(this.props.tableState.page * this.props.tableState.rowsPerPage, this.props.tableState.page * this.props.tableState.rowsPerPage + this.props.tableState.rowsPerPage)
               .map((item, key) => {
                   const tableCells = keys.map((course, cellKey) => {
                       const percent = (item["courseCompletions"][course["key"]]).toFixed(2);
                       return <TableCell key={cellKey}>{+percent}%</TableCell>
                   });
                   return(
                       <TableRow key={key} onClick={() => this.props.handleClick(item.user)}>
                            <TableCell>{item.username}</TableCell>
                            {tableCells}
                       </TableRow>
                   );
               });

    }

    /* utility functions */
    groupChanged(prevProps) {
        return (prevProps.courses !== this.currentData.courses ||
            prevProps.users !== this.currentData.users ||
            prevProps.activities !== this.currentData.activities);
    }

    getTableData(users, courses, activities) {
        if (Object.keys(courses).length === 0 && Object.keys(activities).length === 0 && Object.keys(users).length === 0) {
            return [];
        }

        users = users.result;
        courses = courses.result;
        activities = activities.result;

        let tableData = [];

        let userData = {};
        for (let i in users) {
            let courseCompletions = {};
            for (let i in courses) {
                courseCompletions[courses[i].id] = 0;
            }
            tableData[users[i].id] = {
                user: users[i],
                username: users[i].username,
                courseCompletions: courseCompletions
            };
        }

        for (let i in activities) {
            const activity = activities[i];
            tableData[activity["userId"]]["courseCompletions"][activity["courseId"]] = activity["stepsCompleted"] / activity["stepsTotal"] * 100;
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

}
export default CourseTable;
