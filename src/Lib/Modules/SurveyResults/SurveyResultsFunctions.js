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
            if (isFilteredSurvey(props, surveyId)) {
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
        }

        return Object.values(data);
    },

    getFrqTableData: function(props) {
        let data = [];
        for (let surveyId in props["surveys"]) {
            if (isFilteredSurvey(props, surveyId)) {
                const survey = props["surveys"][surveyId];
                for (let i = 0; i < props["questions"].length; ++i) {
                    const question = props["questions"][i];
                    if (props["question"] === "0" || props["question"] === question) {
                        const results = survey["results"];
                        if (question in results && results[question]) {
                            data.push({
                                index: data.length,
                                surveyId: surveyId,
                                question: question,
                                response: results[question],
                                categories: getCategories(surveyId, question, props["responses"], props["categories"]),
                                submitted: survey["submitted"]
                            });
                        }
                    }
                }
            }
        }

        return data;
    },

    getFrqChartLabels: function(categories) {
        let labels = [];
        for (let categoryKey in categories) {
            labels.push(categories[categoryKey]);
        }

        return labels;
    },

    getFrqChartData: function(props, pQuestion, questions, labels) {
        let data = [];
        for (let i = 0; i < labels.length; ++i) {
            data.push(0);
        }
        for (let surveyId in props["surveys"]) {
            if (isFilteredSurvey(props, surveyId) && (surveyId in props["responses"])) {
                const survey = props["surveys"][surveyId];
                for (let i = 0; i < questions.length; ++i) {
                    const question = questions[i];
                    if (pQuestion === "0" || pQuestion === question) {
                        const results = survey["results"];
                        if (question in results && results[question]) {
                            for (let i = 0; i < props["responses"][surveyId].length; ++i) {
                                const response = props["responses"][surveyId][i];
                                if (pQuestion === "0" || response["question"] === pQuestion) {
                                    const index = labels.indexOf(props["categories"][response["categoryKey"]]);
                                    ++data[index];
                                }
                            }
                        }
                    }
                }
            }
        }

        return data;
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

        else if (props["groupId"] === -2) {
            for (let groupId in props["groups"]) {
                const userIds = props["groups"][groupId]["userIds"];
                const userId = props["surveys"][surveyId]["userId"];
                if (userIds.includes(userId)) {
                    return false;
                }
            }
        }

        else {
            const userIds = props["groups"][props["groupId"]]["userIds"];
            const userId = props["surveys"][surveyId]["userId"];
            if (!userIds.includes(userId)) {
                return false;
            }
        }
    }

    if (props["org"] !== "0") {
        const userId = props["surveys"][surveyId]["userId"];
        if (userId in props["users"]) {
            const user = props["users"][userId];
            if (props["org"] === "-1") {
                if (!user["organization"] || !user["organization"].trim()) {
                    return false;
                }
            }
            else if (props["org"] === "-2") {
                if (user["organization"] && user["organization"].trim()) {
                    return false;
                }
            }
            else if (props["org"] !== user["organization"]) {
                return false;
            }
        }
    }

    if (props["role"] !== "0") {
        const userId = props["surveys"][surveyId]["userId"];
        if (userId in props["users"]) {
            const user = props["users"][userId];
            if (props["role"] === "-1") {
                if (!user["roleWithVeterans"] || !user["roleWithVeterans"].trim()) {
                    return false;
                }
            }
            else if (props["role"] === "-2") {
                if (user["roleWithVeterans"] && user["roleWithVeterans"].trim()) {
                    return false;
                }
            }
            else if (props["role"] !== user["roleWithVeterans"]) {
                return false;
            }
        }
    }

    return true;
}

function getCategories(surveyId, question, responses, categories) {
    let displayCategories = [];
    if (surveyId in responses) {
        for (let row in responses[surveyId]) {
            if (responses[surveyId][row]["question"] === question) {
                displayCategories.push(categories[responses[surveyId][row]["categoryKey"]]);
            }
        }
    }

    return displayCategories.join(",\n");
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
