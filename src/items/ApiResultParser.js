/*
    Take the results of the API and do operations on them
    NOT IN USE YET
*/
class ApiResultParser {
    getCourseTableData(courses, users, activities) {

        let coursesAndActivitiesCombined = [];
        for (let i in courses.result) {
            let courseEntry = {
                course: courses.result[i],
                title: courses.result[i].title
            }
            const courseInfo = this.getCourseTableDataRow(courses.result[i].id, users.count, activities);
            for (let key in courseInfo) {
                courseEntry[key] = courseInfo[key];
            }

            coursesAndActivitiesCombined.push(courseEntry);
        }

        return coursesAndActivitiesCombined;
    }

    getCourseTableDataRow(courseId, userCount, activities) {
        let notStarted = userCount;
        let inProgress = 0;
        let completed = 0;
        for (let activityIndex in activities.result) {
            const activity = activities.result[activityIndex];
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
