  const WPAPI = {
       // allPosts: 'https://learnarmor.com/api/triwest/v1/users/',
       usersEndpoint: 'http://staging.psycharmor.org/wp-json/pai/v1/users',
       coursesEndpoint: 'http://staging.psycharmor.org/wp-json/pai/v1/courses',
       courseActivitiesEndpoint: 'http://staging.psycharmor.org/wp-json/pai/v1/course-activities',
       groupsEndpoint: 'http://staging.psycharmor.org/wp-json/pai/v1/groups',
       allGroupEndpoint: 'http://staging.psycharmor.org/wp-json/uncanny_reporting/v1/dashboard_data//?group_id=all',
       surveyEndpoint: 'http://staging.psycharmor.org/wp-json/pai/v1/survey',
       tinCanDataEndpoint: 'http://staging.psycharmor.org/wp-json/uncanny_reporting/v1/tincan_data/', // add user id for this

       assignmentDataEndpoint: 'http://staging.psycharmor.org/wp-json/uncanny_reporting/v1/assignment_data',


       courseModuleEndpoint: 'http://staging.psycharmor.org/wp-json/uncanny_reporting/v1/course_modules',
       coursesOverviewEndpoint: 'http://staging.psycharmor.org/wp-json/uncanny_reporting/v1/courses_overview//?group_id=9437',

       groupDashboardEndpoint: 'http://staging.psycharmor.org/wp-json/uncanny_reporting/v1/dashboard_data//?group_id=', // add group id
       allGroupDashboardEndpoint: 'http://staging.psycharmor.org/wp-json/uncanny_reporting/v1/dashboard_data', // add group id
       usersCompletedCoursesEndpoint: 'http://staging.psycharmor.org/wp-json/uncanny_reporting/v1/users_completed_courses//?group_id=', // add group id

  }

export default WPAPI;
