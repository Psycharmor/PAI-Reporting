import React from "react";
import {Doughnut} from "react-chartjs-2";

class CourseSummary extends React.Component {
    render() {
        const title = (this.props.course.title ? this.props.course.title + " summary" : "");
        const doughnut = this.renderDoughnut();

        return(
            <div>
                <h3>{title}</h3>
                {doughnut}
            </div>
        );
    }

    renderDoughnut() {
        if (this.props.course.title && this.props.users.result && this.props.activities.result) {

            const data = this.getData(this.combineUsersAndActivities(this.props.users, this.props.course));
            return(
                <Doughnut
                    data={data}
                    options={{
                        elements: {
                            arc: {
                                borderWidth: 0
                            }
                        }
                    }}
                />
            );
        }
    }

    getData(userData) {
        let labels = [
            "Number of Learners who Completed the Course",
            "Number of Learners Who Did Not Complete the Course"
        ];
        let data = [0, 0];
        for (let i in userData) {
            if (userData[i].completed >= 100) {
                ++data[0];
            }
            else {
                ++data[1];
            }
        }

        return {
            labels: labels,
            datasets: [
                {
                    label: "Course Completion Ratio",
                    backgroundColor: [
                        "#4168B1",
                        "#CCCCCC"
                    ],
                    data: data
                }
            ]
        };
    }

    combineUsersAndActivities(users, course) {
        let usersAndActivitiesCombined = [];
        for (let i in users.result) {
            let userEntry = {
                username: users.result[i].username
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
            completed: percentComplete
        };
    }
}
export default CourseSummary;
