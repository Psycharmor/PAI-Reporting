import React from "react";
import {Bar, Doughnut} from "react-chartjs-2";

class UserSummary extends React.Component {
    render() {
        const title = (this.props.user.username ? this.props.user.username + "'s Profile" : "");
        const barGraph = this.renderBarGraph();
        const doughnut = this.renderDoughnut();

        return(
            <div>
                <h3>{title}</h3>
                <div className="charts-col-direction">
                    {barGraph}
                    {doughnut}
                </div>
            </div>
        );
    }

    renderBarGraph() {
        if (this.props.user.username && this.props.courses.result && this.props.activities.result) {
            const barData = this.getBarData(this.combineCoursesAndActivities(this.props.courses, this.props.user));
            return(
                <div className="inline-chart">
                    <Bar
                        data={barData}
                        options={{
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        min: 0,
                                        max: 100
                                    },
                                    gridLines: {
                                        display: false
                                    }
                                }]
                            },
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            );
        }
    }

    renderDoughnut() {
        if (this.props.user.username && this.props.courses.result && this.props.activities.result) {
            const data = this.getDoughnutData(this.combineCoursesAndActivities(this.props.courses, this.props.user));
            return(
                <div className="inline-chart">
                    <Doughnut
                        data={data}
                        options={{
                            elements: {
                                arc: {
                                    borderWidth: 0
                                }
                            },
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            );
        }
    }

    getBarData(courseData) {
        let labels = [];
        let data = [];
        for (let i in courseData) {
            labels.push(courseData[i].title);
            data.push(courseData[i].completed);
        }

        return {
            labels: labels,
            datasets: [
                {
                    label: "Course Progress",
                    backgroundColor: "#4168B1",
                    data: data
                }
            ]
        };
    }



    getDoughnutData(courseData) {
        let labels = [
            "Courses Completed",
            "Courses not Completed"
        ];
        let data = [0, 0];
        for (let i in courseData) {
            if (courseData[i].completed >= 100) {
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

    combineCoursesAndActivities(courses, user) {
        let coursesAndActivitiesCombined = [];
        for (let i in courses.result) {
            let courseEntry = {
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
            completed: percentComplete
        };
    }
}
export default UserSummary;
