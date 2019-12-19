import React, {forwardRef} from "react";

import MaterialTable from "material-table";
import {AddBox, ArrowUpward, Check, ChevronLeft, ChevronRight,
        Clear, DeleteOutline, Edit, FilterList, FirstPage,
        LastPage, Remove, SaveAlt, Search, ViewColumn
        } from "@material-ui/icons";

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const UserDemographics = (props) => {
    let columns = [];
    let data = {};
    if (Object.keys(props["entries"]).length !== 0) {
        columns = [
            {title: "Email", field: "email"},
            {title: "First Name", field: "firstName"},
            {title: "Last Name", field: "lastName"},
            {title: "Organization", field: "organization"},
            {title: "Role With Veterans", field: "roleWithVeterans"},
            {title: "Referral Source", field: "refferalSource"},
            {title: "Courses Completed", field: "courseCompleteCount"},
            {title: "Team", field: "team"}
        ];

        if (props["portfolio"] === -1) {
            if (props["courseId"] === -1) {
                for (let portfolioKey in props["entries"]) {
                    for (let courseKey in props["entries"][portfolioKey]["courses"]) {
                        for (let i = 0; i < props["entries"][portfolioKey]["courses"][courseKey]["entries"].length; ++i) {
                            const entry = props["entries"][portfolioKey]["courses"][courseKey]["entries"][i];
                            const submitted = entry["dateSubmitted"];
                            if (submitted >= (props["startDate"].getTime() / 1000) && submitted <= (props["endDate"].getTime() / 1000)) {
                                if (!(entry["userId"] in data)) {
                                    data[entry["userId"]] = {
                                        email: entry["email"],
                                        firstName: entry["firstName"],
                                        lastName: entry["lastName"],
                                        organization: entry["organization"],
                                        roleWithVeterans: entry["roleWithVeterans"],
                                        refferalSource: entry["refferalSource"],
                                        courseCompleteCount: entry["courseCompleteCount"],
                                        team: entry["team"]
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }

        else {
            if (props["courseId"] === -1) {
                for (let courseKey in props["entries"][props["portfolio"]]["courses"]) {
                    for (let i = 0; i < props["entries"][props["portfolio"]]["courses"][courseKey]["entries"].length; ++i) {
                        const entry = props["entries"][props["portfolio"]]["courses"][courseKey]["entries"][i];
                        if (!(entry["userId"] in data)) {
                            data[entry["userId"]] = {
                                email: entry["email"],
                                firstName: entry["firstName"],
                                lastName: entry["lastName"],
                                organization: entry["organization"],
                                roleWithVeterans: entry["roleWithVeterans"],
                                refferalSource: entry["refferalSource"],
                                courseCompleteCount: entry["courseCompleteCount"],
                                team: entry["team"]
                            };
                        }
                    }
                }
            }

            else {
                for (let i = 0; i < props["entries"][props["portfolio"]]["courses"][props["courseId"]]["entries"].length; ++i) {
                    const entry = props["entries"][props["portfolio"]]["courses"][props["courseId"]]["entries"][i];
                    if (!(entry["userId"] in data)) {
                        data[entry["userId"]] = {
                            email: entry["email"],
                            firstName: entry["firstName"],
                            lastName: entry["lastName"],
                            organization: entry["organization"],
                            roleWithVeterans: entry["roleWithVeterans"],
                            refferalSource: entry["refferalSource"],
                            courseCompleteCount: entry["courseCompleteCount"],
                            team: entry["team"]
                        };
                    }
                }
            }
        }

        return (
            <MaterialTable
                icons={tableIcons}
                columns={columns}
                data={Object.values(data)}
                options={{
                    showTitle: false,
                    pageSize: 10,
                    draggable: false,
                    headerStyle: {
                        paddingTop: 0,
                        paddingBottom: 0
                    },
                    rowStyle: {
                        paddingTop: 0,
                        paddingBottom: 0
                    },
                    doubleHorizontalScroll: true,
                    exportAllData: true,
                    exportButton: true
                }}
            />
        );
    }

    return(
        <div></div>
    );
}
export default UserDemographics;
