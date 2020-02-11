const SurveyResultsFunctions = {
    getYesNoData: function(props, questions) {
        let datasets = [
            {
                label: "Yes",
                backgroundColor: "#5e72e4",
                barPercentage: 0.7,
                stack: "Stack 0",
                datalabels: {
                    anchor: "end",
                    align: "end"
                },
                data: [0, 0, 0, 0, 0, 0]
            },
            {
                label: "No",
                backgroundColor: "#dc3545",
                barPercentage: 0.7,
                stack: "Stack 0",
                datalabels: {
                    anchor: "end",
                    align: "end"
                },
                data: [0, 0, 0, 0, 0, 0]
            }
        ];
        const surveys = props["surveys"];
        for (let surveyId in surveys) {
            if (isFilteredSurvey(props, surveyId)) {
                const results = surveys[surveyId]["results"];
                for (let i = 0; i < questions.length; ++i) {
                    const question = questions[i];
                    if (question in results) {
                        let datasetIndex = 1;
                        if (results[question] === "Yes") {
                            datasetIndex = 0;
                        }
                        ++datasets[datasetIndex]["data"][i];
                    }
                }
            }
        }

        return datasets;
    },

    getDemographicsData: function(props) {
        let data = {};
        const pActivities = parseActivities(props["activities"]);
        for (let surveyId in props["surveys"]) {
            const survey = props["surveys"][surveyId];
            if (!(survey["userId"] in data) && (survey["userId"] in props["users"])) {
                const userId = survey["userId"];
                data[userId] = {
                    firstName: props["users"][userId]["firstName"],
                    lastName: props["users"][userId]["lastName"],
                    email: props["users"][userId]["email"],
                    team: getTeam(props["groups"], userId, survey["courseId"]),
                    organization: props["users"][userId]["organization"],
                    roleWithVeterans: props["users"][userId]["roleWithVeterans"],
                    referralSource: props["users"][userId]["referralSource"],
                    courseCompletionCount: getUserCourseCompletionCount(userId, pActivities)
                };
            }
        }

        return Object.values(data);
    }
};
export default SurveyResultsFunctions;

function isFilteredSurvey(props, surveyId) {
    if (props["portfolioId"] !== 0) {
        const courseId = props["surveys"][surveyId]["courseId"];
        const portfolio = props["portfolios"][props["portfolioId"]];
        if (!portfolio["courseIds"].includes(courseId)) {
            return false;
        }
    }

    if (props["courseId"] !== 0) {
        const surveyCourseId = props["surveys"][surveyId]["courseId"];
        if (props["courseId"] !== surveyCourseId) {
            return false;
        }
    }

    if (props["startDate"].unix() > props["surveys"][surveyId]["submitted"]) {
        return false;
    }

    if (props["endDate"].unix() < props["surveys"][surveyId]["submitted"]) {
        return false;
    }

    if (props["groupId"] !== 0) {
        if (props["groupId"] === -1) {
            let inGroup = false;
            for (let groupId in props["groups"]) {
                const userIds = props["groups"][groupId]["userIds"];
                const userId = props["surveys"][surveyId]["userId"];
                if (userIds.includes(userId)) {
                    inGroup = true;
                }
            }
            if (!inGroup) {
                return false;
            }
        }

        if (props["groupId"] === -2) {
            for (let groupId in props["groups"]) {
                const userIds = props["groups"][groupId]["userIds"];
                const userId = props["surveys"][surveyId]["userId"];
                if (userIds.includes(userId)) {
                    return false;
                }
            }
        }
    }

    return true;
}

function getTeam(groups, userId, courseId) {
    for (let groupId in groups) {
        if (groups[groupId]["courseIds"].includes(courseId) && groups[groupId]["userIds"].includes(userId)) {
            return groups[groupId]["title"];
        }
    }

    return "";
}

function getUserCourseCompletionCount(userId, pActivities) {
    let count = 0;
    for (let courseId in pActivities[userId]) {
        const activity = pActivities[userId][courseId];
        if (activity["status"]) {
            ++count;
        }
    }

    return count;
}

function parseActivities(activities) {
    let pActivities = {};
    for (let activityId in activities) {
        const activity = activities[activityId];
        if (!(activity["userId"] in pActivities)) {
            pActivities[activity["userId"]] = {};
        }
        pActivities[activity["userId"]][activity["courseId"]] = activity;
    }

    return pActivities;
}
