const TableDataProcessor = {
    getDashboardHeaders:(group, subgroups) => {
        /*
            Set the table headers for the dashboard page for the group and
            subgroups if available
            Headers: Username, course titles...
            Params:
                group           -> (obj) the group's users, courses, activities
                subgroups       -> (obj) each subgroups' users, courses, activities
            Return:
                obj             -> array of headers separated by group/subgroups
        */
        let groupHeaders = [{
            title: "Username",
            field: "username",
            customSort: (a, b) => {
                if (a["username"].toUpperCase() < b["username"].toUpperCase()) {
                    return -1;
                }
                else if (a["username"].toUpperCase() > b["username"].toUpperCase()) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        }];
        for (let courseId in group["courses"]) {
            groupHeaders.push({
                title: group["courses"][courseId]["title"],
                field: group["courses"][courseId]["id"].toString(),
                customSort: (a, b) => {
                    const aStr = a[group["courses"][courseId]["id"]];
                    const aValue = parseFloat(aStr.substring(0, aStr.length - 1));

                    const bStr = b[group["courses"][courseId]["id"]];
                    const bValue = parseFloat(bStr.substring(0, bStr.length - 1));

                    return aValue - bValue;
                }
            });
        }

        let subgroupHeaders = {};
        for (let subgroupId in subgroups) {
            const subgroup = subgroups[subgroupId];
            subgroupHeaders[subgroupId] = [{
                title: "Username",
                field: "username",
                customSort: (a, b) => {
                    if (a["username"].toUpperCase() < b["username"].toUpperCase()) {
                        return -1;
                    }
                    else if (a["username"].toUpperCase() > b["username"].toUpperCase()) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            }];
            for (let courseId in subgroup["courses"]) {
                subgroupHeaders[subgroupId].push({
                    title: subgroup["courses"][courseId]["title"],
                    field: subgroup["courses"][courseId]["id"].toString(),
                    customSort: (a, b) => {
                        const aStr = a[subgroup["courses"][courseId]["id"]];
                        const aValue = parseFloat(aStr.substring(0, aStr.length - 1));

                        const bStr = b[subgroup["courses"][courseId]["id"]];
                        const bValue = parseFloat(bStr.substring(0, bStr.length - 1));

                        return aValue - bValue;
                    }
                });
            }
        }

        return {
            group: groupHeaders,
            subgroups: subgroupHeaders
        };
    },

    getVrhpoHeaders: (group, subgroups) => {
        const groupHeaders = [
            {
                title: "Username",
                field: "username",
                customSort: (a, b) => {
                    if (a["username"].toUpperCase() < b["username"].toUpperCase()) {
                        return -1;
                    }
                    else if (a["username"].toUpperCase() > b["username"].toUpperCase()) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            },
            {
                title: "Requirements Met?",
                field: "reqsMet",
                customSort: (a, b) => {
                    if (a["reqsMet"] === "YES") {
                        if (b["reqsMet"] === "YES") {
                            return 0;
                        }
                        else {
                            return -1;
                        }
                    }
                    else {
                        if (b["reqsMet"] === "YES") {
                            return 1;
                        }
                        else {
                            return 0;
                        }
                    }
                }
            }
        ];

        let subgroupHeaders = {};
        for (let subgroupId in subgroups) {
            subgroupHeaders[subgroupId] = [
                {
                    title: "Username",
                    field: "username",
                    customSort: (a, b) => {
                        if (a["username"].toUpperCase() < b["username"].toUpperCase()) {
                            return -1;
                        }
                        else if (a["username"].toUpperCase() > b["username"].toUpperCase()) {
                            return 1;
                        }
                        else {
                            return 0;
                        }
                    }
                },
                {
                    title: "Requirements Met?",
                    field: "reqsMet",
                    customSort: (a, b) => {
                        if (a["reqsMet"] === "YES") {
                            if (b["reqsMet"] === "YES") {
                                return 0;
                            }
                            else {
                                return -1;
                            }
                        }
                        else {
                            if (b["reqsMet"] === "YES") {
                                return 1;
                            }
                            else {
                                return 0;
                            }
                        }
                    }
                }
            ];
        }

        return {
            group: groupHeaders,
            subgroups: subgroupHeaders
        };
    },

    getDashboardData: (userId, group, subgroups) => {

        let groupUserData = {username: group["users"][userId]["username"]};
        for (let courseId in group["courses"]) {
            let progress = 0;
            if ((userId in group["activities"]) && (courseId in group["activities"][userId])) {
                const activity = group["activities"][userId][courseId];
                const stepsCompleted = activity["stepsCompleted"];
                const stepsTotal = activity["stepsTotal"];
                progress = +(stepsCompleted / stepsTotal * 100).toFixed(2);
            }
            groupUserData[courseId.toString()] = progress + "%";
        }

        let subgroupUserData = {};
        for (let subgroupId in subgroups) {
            subgroupUserData[subgroupId] = {};
            const subgroup = subgroups[subgroupId];
            if (userId in subgroup["users"]) {
                subgroupUserData[subgroupId]["username"] = group["users"][userId]["username"];

                for (let courseId in subgroup["courses"]) {
                    let progress = 0;
                    if ((userId in subgroup["activities"]) && (courseId in subgroup["activities"][userId])) {
                        const activity = subgroup["activities"][userId][courseId];
                        const stepsCompleted = activity["stepsCompleted"];
                        const stepsTotal = activity["stepsTotal"];

                        progress = +(stepsCompleted / stepsTotal * 100).toFixed(2);
                    }
                    subgroupUserData[subgroupId][courseId.toString()] = progress + "%";
                }
            }
        }

        return {
            group: groupUserData,
            subgroups: subgroupUserData
        };
    },

    getVrhpoData: (userId, group, subgroups) => {
        let groupUserData = {};
        let subgroupUserData = {};

        return {
            group: groupUserData,
            subgroups: subgroupUserData
        };
    }
};
export default TableDataProcessor;
