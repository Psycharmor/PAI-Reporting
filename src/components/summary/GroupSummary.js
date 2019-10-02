import React from "react";
import {Bar} from 'react-chartjs-2'; // electric boogaloo

class GroupSummary extends React.Component {

    render() {

        const barGraph = this.renderGraph();

        return(
            <div>
                <h4>Group Summary</h4>
                {barGraph}
            </div>
        );
    }

    renderGraph() {
        if (this.props.groupInfo.result) {
            const group = this.props.groupInfo.result[0];
            const data = this.getData(this.combineCoursesAndActivities(this.props.courses, group.enrolledUsers));
            return(
                <Bar
                    data={data}
                    options={{
                        scales: {
                            yAxes: [{
                                ticks: {
                                    min: 0,
                                    max: Math.ceil(group.enrolledUsers.length / 5) * 5
                                },
                                gridLines: {
                                    display: false
                                }
                            }]
                        }
                    }}
                />
            );
        }
    }

    getData(courseData) {
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
                    label: "Course Completion Count",
                    backgroundColor: "#4168B1",
                    data: data
                }
            ]
        };
    }

    combineCoursesAndActivities(courses, users) {

        let coursesAndActivitiesCombined = [];
        for (let i in courses.result) {
            let courseEntry = {
                title: courses.result[i].title
            }
            const courseInfo = this.getCourseInfo(courses.result[i].id, users.count);
            for (let key in courseInfo) {
                courseEntry[key] = courseInfo[key];
            }

            coursesAndActivitiesCombined.push(courseEntry);
        }

        return coursesAndActivitiesCombined;
    }

    getCourseInfo(courseId, userCount) {
        let notStarted = userCount;
        let inProgress = 0;
        let completed = 0;
        for (let activityIndex in this.props.activities.result) {
            const activity = this.props.activities.result[activityIndex];
            if (activity["courseId"] === courseId) {
                --notStarted;
                if (activity["stepsCompleted"] < activity["stepsTotal"]) {
                    ++inProgress;
                }
                if (activity["status"] === 1) {
                    ++completed;
                }
            }
        }

        return {
            notStarted: notStarted,
            inProgress: inProgress,
            completed: completed
        };
    }
}
export default GroupSummary;
