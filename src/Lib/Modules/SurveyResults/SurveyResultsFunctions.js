const SurveyResultsFunctions = {
    getYesNoData(props, questions) {
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
                const caregiver = surveys[surveyId]["CaregiverCG2"];

                if (results){
                  for (let i = 0; i < questions.length; ++i) {
                      const question = questions[i];
                      if (question in results) {
                          if (results[question] === "Yes") {
                              ++datasets[0]["data"][i];
                          }
                          else if (results[question] === "No") {
                              ++datasets[1]["data"][i];
                          }
                      }
                  }
                }
                if ( caregiver ){
                  for (let caregiverresults in caregiver) {

                    const results = surveys[surveyId]["CaregiverCG2"]["results"];
                    // console.log("results",results);

                    for (let i = 0; i < questions.length; ++i) {
                        const question = questions[i];
                        if (question in results) {
                            if (results[question] === "Yes") {
                                ++datasets[0]["data"][i];
                            }
                            else if (results[question] === "No") {
                                ++datasets[1]["data"][i];
                            }
                        }
                    }
                  }
                }
            }
        }

        return datasets;
    },

    getDemographicsData(props) {
        let data = {};
        const pActivities = parseActivities(props["activities"]);
        for (let surveyId in props["surveys"]) {
            if (isFilteredSurvey(props, surveyId)) {
                const survey = props["surveys"][surveyId];

                if ( survey["results"] ){
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
                if( survey["CaregiverCG2"]){


                }
            }
        }

        return Object.values(data);
    },

    getFrqTableData(props) {
        let data = [];
        for (let surveyId in props["surveys"]) {
            if (isFilteredSurvey(props, surveyId)) {
                const survey = props["surveys"][surveyId];
                if ( survey["results"] ){
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
                if( survey["CaregiverCG2"]){


                }
            }
        }

        return data;
    },

    getFrqChartLabels(categories) {
        let labels = [];
        for (let categoryKey in categories) {
            labels.push(categories[categoryKey]);
        }

        return labels;
    },



    getFrqChartData(props, question, labels) {
        let data = [];
        for (let i = 0; i < labels.length; ++i) {
            data.push(0);
        }
        const surveys = props["surveys"];
        const responses = props["responses"];

        for (let surveyId in surveys ) {

            if (isFilteredSurvey(props, surveyId) && (surveyId in props["responses"])  ) {
            // if (isFilteredSurvey(props, surveyId) ) {
                const caregiver = surveys[surveyId]["CaregiverCG2"];
                const results = surveys[surveyId]["results"];

                // if( results in surveys ){
                  if (question in results && results[question]) {
                      for (let i = 0; i < props["responses"][surveyId].length; ++i) {
                          const response = props["responses"][surveyId][i];
                          if (response["question"] === question) {
                              const index = labels.indexOf(props["categories"][response["categoryKey"]]);
                              ++data[index];
                          }
                      }
                  }
                // }
                // if( caregiver in surveys ){
                //   for (let caregiverresults in caregiver) {
                //       const results = surveys[surveyId]["CaregiverCG2"]["results"];
                //
                //       if (question in results && results[question]) {
                //           for (let i = 0; i < props["responses"][surveyId].length; ++i) {
                //               const response = props["responses"][surveyId][i];
                //               if (response["question"] === question) {
                //                   const index = labels.indexOf(props["categories"][response["categoryKey"]]);
                //                   ++data[index];
                //               }
                //           }
                //       }
                //
                //   }
                //
                // }
            }
        }
        return data;
    },

    getAllCaregiverResponses(props) {
        const { surveys, question } = props;
        const responses = [];

        for (let surveyId in surveys) {
            if (!isFilteredSurvey(props, surveyId)) continue;
            const { results } = surveys[surveyId];
            if (!(question in results)) continue;
            const result = results[question];
            if (!result) continue;
            responses.push(result);
        }

        return responses;
    },

    getCaregiverBarChartData(props) {
        const { surveys, labels, question } = props;
        const data = labels.reduce((obj, item) => {
            obj[item] = 0;
            return obj;
        }, {});

        for (let surveyId in surveys) {
            if (!isFilteredSurvey(props, surveyId)) continue;
            const { results } = surveys[surveyId];
            if (!(question in results)) continue;
            const result = results[question];
            if (!labels.includes(result)) continue;
            data[result]++;
        }

        return labels.map(label => data[label]);
    },

    getCaregiverMultiBarChartData(props) {
        const { surveys, labels, question } = props;
        const data = labels.reduce((obj, item) => {
            obj[item] = 0;
            return obj;
        }, {});

        for (let surveyId in surveys) {
            if (!isFilteredSurvey(props, surveyId)) continue;
            const { results } = surveys[surveyId];
            if (!(question in results)) continue;
            const answers = JSON.parse(results[question]) || [];
            answers.forEach(result => {
                if (!labels.includes(result)) return;
                data[result]++;
            })
        }

        return labels.map(label => data[label]);
    },

    getCaregiverFrqChartData(props) {
        const { surveys, labels, question } = props;
        const data = labels.reduce((obj, item) => {
            obj[item] = 0;
            return obj;
        }, {});

        for (let surveyId in surveys) {
            if (!isFilteredSurvey(props, surveyId)) continue;
            const { results } = surveys[surveyId];
            if (!(question in results)) continue;
            const result = results[question];
            if (!labels.includes(result)) continue;
            data[result]++;
        }

        return labels.map(label => data[label]);
    },

    getRatingGroupMeansData(props, labels) {
        let data = [];
        for (let i = 0; i < labels.length; ++i) {
            data.push({
                result: {
                    pre: 0,
                    post: 0
                },
                userCount: {
                    pre: 0,
                    post: 0
                }
            });
        }
        for (let surveyId in props["surveys"]) {
            if (isFilteredSurvey(props, surveyId)) {
                const survey = props["surveys"][surveyId];
                if ( survey["results"] ){
                  for (let i = 0; i < labels.length; ++i) {
                      const label = labels[i];
                      if (label in survey["results"]) {
                          const result = survey["results"][label];
                          if (result["before"] && result["before"].trim()) {
                              ++data[i]["userCount"]["pre"];
                              data[i]["result"]["pre"] += parseInt(result["before"]);
                          }
                          if (result["now"] && result["now"].trim()) {
                              ++data[i]["userCount"]["post"];
                              data[i]["result"]["post"] += parseInt(result["now"]);
                          }
                      }
                  }
                }
                if( survey["CaregiverCG2"]){


                }

            }
        }
        for (let i = 0; i < data.length; ++i) {
            const pre = (data[i]["userCount"]["pre"]) ? data[i]["result"]["pre"] / data[i]["userCount"]["pre"] : 0;
            const post = (data[i]["userCount"]["post"]) ? data[i]["result"]["post"] / data[i]["userCount"]["post"] : 0;
            data[i] = +((post - pre).toFixed(2));
        }

        return data;
    },

    getRatingScoreMeansData(props, labels) {
        let data = [];
        for (let i = 0; i < labels.length; ++i) {
            data.push({
                result: 0,
                userCount: 0
            });
        }
        for (let surveyId in props["surveys"]) {
            if (isFilteredSurvey(props, surveyId)) {
                const survey = props["surveys"][surveyId];
                if ( survey["results"] ){
                  for (let i = 0; i < labels.length; ++i) {
                      const label = labels[i];
                      if (label in survey["results"]) {
                          const result = survey["results"][label];
                          if ((result["before"] && result["before"].trim()) || (result["now"] && result["now"].trim())) {
                              ++data[i]["userCount"];
                              const pre = (result["before"] && result["before"].trim()) ? parseInt(result["before"]) : 0;
                              const post = (result["now"] && result["now"].trim()) ? parseInt(result["now"]) : 0;
                              data[i]["result"] += post - pre;
                          }
                      }
                  }
                }
                if( survey["CaregiverCG2"]){


                }

            }
        }
        for (let i = 0; i < data.length; ++i) {
            data[i] = (data[i]["userCount"]) ? data[i]["result"] / data[i]["userCount"] : 0;
            data[i] = +(data[i].toFixed(2));
        }
        return data;
    },

    getRatingData(props) {
        const dataLength = 2;
        let data = [];
        for (let i = 0; i < dataLength; ++i) {
            data.push({
                result: 0,
                userCount: 0
            });
        }

        for (let surveyId in props["surveys"]) {
            if (isFilteredSurvey(props, surveyId)) {
                const survey = props["surveys"][surveyId];
                if ( survey["results"] ){
                  if (props["question"] in survey["results"]) {
                      const result = survey["results"][props["question"]];
                      if (result["before"] && result["before"].trim()) {
                          ++data[0]["userCount"];
                          data[0]["result"] += parseInt(result["before"]);
                      }
                      if (result["now"] && result["now"].trim()) {
                          ++data[1]["userCount"];
                          data[1]["result"] += parseInt(result["now"]);
                      }
                  }
                }
                if( survey["CaregiverCG2"]){


                }

            }
        }
        // for (let i = 0; i < data.length; ++i) {
        //     data[i] = (data[i]["result"] > 0) ? data[i]["result"] / data[i]["userCount"] : 0;
        //     data[i] = +(data[i].toFixed(2));
        // }

        return data;
    },

    createExportData(props) {

        let data = [createExportHeaders()];
        const pActivities = parseActivities(props["activities"]);
        for (let surveyId in props["surveys"]) {
            if (isFilteredSurvey(props, surveyId)) {

                const survey = props["surveys"][surveyId];

                if ( survey["results"] ){

                    data.push(createExportRows(survey, props, pActivities));
                }
                if( survey["CaregiverCG2"]){

                    // console.log("CaregiverCG2");
                }

            }
        }

        return data;
    }
};
export default SurveyResultsFunctions;

function isFilteredSurvey(props, surveyId) {
    if (props["portfolioId"] !== 0) {

      const survey = props["surveys"][surveyId];
      if ( survey["results"] ){
        const courseId = props["surveys"][surveyId]["courseId"];
        const portfolio = props["portfolios"][props["portfolioId"]];
        if (!portfolio["courseIds"].includes(courseId)) {
            return false;
        }
      }
    }

    if (props["courseId"] !== 0) {
      const survey = props["surveys"][surveyId];
      if ( survey["results"] ){
        const surveyCourseId = props["surveys"][surveyId]["courseId"];
        if (props["courseId"] !== surveyCourseId) {
            return false;
        }
      }

    }

    const survey = props["surveys"][surveyId];

    if ( survey["results"] ){
      if (props["startDate"].unix() > props["surveys"][surveyId]["submitted"]) {
          return false;
      }

      if (props["endDate"].unix() < props["surveys"][surveyId]["submitted"]) {
          return false;
      }
    }


    if (props["groupId"] !== 0) {
        if (props["groupId"] === -1) {
            let inGroup = false;
            for (let groupId in props["groups"]) {
                const userIds = props["groups"][groupId]["userIds"];

                const survey = props["surveys"][surveyId];
                if ( survey["results"] ){
                  const userId = props["surveys"][surveyId]["userId"];
                  if (userIds.includes(userId)) {
                      inGroup = true;
                  }
                }
            }
            if (!inGroup) {
                return false;
            }
        }

        else if (props["groupId"] === -2) {
            for (let groupId in props["groups"]) {
                const userIds = props["groups"][groupId]["userIds"];

                const survey = props["surveys"][surveyId];
                if ( survey["results"] ){
                  const userId = props["surveys"][surveyId]["userId"];
                  if (userIds.includes(userId)) {
                      return false;
                  }
                }
            }
        }

        else {
            const userIds = props["groups"][props["groupId"]]["userIds"];

            const survey = props["surveys"][surveyId];
            if ( survey["results"] ){
              const userId = props["surveys"][surveyId]["userId"];
              if (!userIds.includes(userId)) {
                  return false;
              }
            }

        }
    }

    if (props["org"] !== "0") {
      const survey = props["surveys"][surveyId];
      if ( survey["results"] ){
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
    }

    if (props["role"] !== "0") {
        const survey = props["surveys"][surveyId];
        if ( survey["results"] ){
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

function createExportHeaders() {
    return [
        "First Name",
        "Last Name",
        "Email",
        "Team",
        "Organization",
        "Role With Veterans",
        "Courses Completed",
        "Referral Source",
        "I learned something new as a result of this training.",
        "The information presented was relevant to my goals.",
        "After taking this course, I will use what I learned.",
        "I would recommend PsychArmor training to someone else.",
        "I am more aware of available resources as a result of this course.",
        "Would you participate in more detailed evaluation?",
        "Why did you take this course?",
        "What aspects of the course did you find especially helpful",
        "What aspects of the course would you like to see changed",
        "Knowledge in this area - Before",
        "Knowledge in this area - Now",
        "Skills related to topic - Before",
        "Skills related to topic - Now",
        "Confidence with topic - Before",
        "Confidence with topic - Now",
        "Application: We are interested in understanding how you applied the content",
        "Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions?"
    ];
}

function createExportRows(survey, props, pActivities) {
    const userId = survey["userId"];
    let row = [
        (userId in props["users"]) ? props["users"][userId]["firstName"] : "",
        (userId in props["users"]) ? props["users"][userId]["lastName"] : "",
        (userId in props["users"]) ? props["users"][userId]["email"] : "",
        getUserTeam(props["groups"], survey["userId"], survey["courseId"]),
        (userId in props["users"]) ? props["users"][userId]["organization"] : "",
        (userId in props["users"]) ? props["users"][userId]["roleWithVeterans"] : "",
        getUserCourseCompletionCount(userId, pActivities),
        (userId in props["users"]) ? props["users"][userId]["referralSource"] : "",
        survey["results"]["I learned something new as a result of this training."] || "",
        survey["results"]["The information presented was relevant to my goals."] || "",
        survey["results"]["After taking this course, I will use what I learned."] || "",
        survey["results"]["I would recommend PsychArmor training to someone else."] || "",
        survey["results"]["I am more aware of available resources as a result of this course."] || "",
        survey["results"]["Would you participate in more detailed evaluation?"] || "",
    ];

    if (survey["results"]["Why did you take this course?"]) {
        row.push(survey["results"]["Why did you take this course?"].join(", "));
    }
    else {
        row.push("");
    }

    row.push(survey["results"]["What aspects of the course did you find especially helpful"] || "");
    row.push(survey["results"]["What aspects of the course would you like to see changed"] || "");

    if (survey["results"]["Knowledge in this area"]) {
        row.push(survey["results"]["Knowledge in this area"]["before"] || "");
        row.push(survey["results"]["Knowledge in this area"]["now"] || "");
    }
    else {
        row.push("");
        row.push("");
    }

    if (survey["results"]["Skills related to topic"]) {
        row.push(survey["results"]["Skills related to topic"]["before"] || "");
        row.push(survey["results"]["Skills related to topic"]["now"] || "");
    }
    else {
        row.push("");
        row.push("");
    }

    if (survey["results"]["Confidence with topic"]) {
        row.push(survey["results"]["Confidence with topic"]["before"] || "");
        row.push(survey["results"]["Confidence with topic"]["now"] || "");
    }
    else {
        row.push("");
        row.push("");
    }

    row.push(survey["results"]["Application: We are interested in understanding how you applied the content"] || "");
    row.push(survey["results"]["Would you be interested in having your name entered into a drawing for FREE follow-up coaching sessions?"] || "");

    return row;
}

function getUserTeam(groups, userId, courseId) {
    for (let groupId in groups) {
        const group = groups[groupId];
        if (group["courseIds"].includes(courseId) && group["userIds"].includes(userId)) {
            return group["title"];
        }
    }

    return "";
}
