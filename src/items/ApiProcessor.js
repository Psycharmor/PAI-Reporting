const ApiProcessor = {

    getSubGroupUsersAndCourses: (nextApi) => {
        /*
            Go through all the data for the next team and get the subgroup(s)
            users and courses if available
            Params:
                nextApi         -> (Obj) all the results of the api calls
            Return:
                Obj             -> all data about the subgroup(s)
        */

        let subgroups = {};
        const groupInfo = nextApi["apiInfo"][Object.keys(nextApi["apiInfo"])[0]];

        // get users and courses
        for (let subgroupId in groupInfo["subGroups"]) {
            let users = {};
            for (let i = 0; i < groupInfo["subGroups"][subgroupId]["enrolledUsers"].length; ++i) {
                const userId = groupInfo["subGroups"][subgroupId]["enrolledUsers"][i];
                users[userId] = nextApi["apiUsers"][userId];
            }

            let courses = {};
            for (let i = 0; i < groupInfo["subGroups"][subgroupId]["courses"].length; ++i) {
                const courseId = groupInfo["subGroups"][subgroupId]["courses"][i];
                courses[courseId] = nextApi["apiCourses"][courseId];
            }

            subgroups[subgroupId] = {
                users: users,
                courses: courses,
                activities: {}
            };
        }

        return subgroups;
    },

    parseCourseActivities: (nextApi, doSubgroup, group, subgroups) => {
        /*
            parse the course activities for the group. If we are also doing
            subgroup, add their data as well
            Params:
                nextApi         -> (obj) the data retrieved from the api
                doSubgroup      -> (bool) whether to also add to subgroups or not
            Return:
                undefined
        */

        // go through all activities for the group and only get the activity
        // if the activity user and activity course matches a user and course in
        // the group.
        for (let activityId in nextApi["apiActivities"]) {
            const activity = nextApi["apiActivities"][activityId];

            // do the process for every subgroup in group first
            if (doSubgroup) {
                for (let subgroupId in subgroups) {
                    if (activity["userId"] in subgroups[subgroupId]["users"] &&
                            activity["courseId"] in subgroups[subgroupId]["courses"]) {
                        // const key = activity["userId"] + "_" + activity["courseId"];
                        if (!(activity["userId"] in subgroups[subgroupId]["activities"])) {
                            subgroups[subgroupId]["activities"][activity["userId"]] = {};
                        }
                        subgroups[subgroupId]["activities"][activity["userId"]][activity["courseId"]] = activity;
                    }
                }
            }

            // then do for the group
            if (activity["userId"] in group["users"] && activity["courseId"] in group["courses"]) {
                // const key = activity["userId"] + "_" + activity["courseId"];
                if (!(activity["userId"] in group["activities"])) {
                    group["activities"][activity["userId"]] = {};
                }
                group["activities"][activity["userId"]][activity["courseId"]] = activity;
            }
        }
    }
};
export default ApiProcessor;
