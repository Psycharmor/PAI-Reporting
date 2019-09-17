  const WPAPI = {
       // allPosts: 'https://learnarmor.com/api/triwest/v1/users/',
       usersEndpoint: 'http://localhost:8008/wp-json/pai/v1/users/?',
       coursesEndpoint: 'http://localhost:8008/wp-json/pai/v1/course-activities',
       allGroupEndpoint: 'http://localhost:8008/wp-json/uncanny_reporting/v1/dashboard_data//?group_id=all',
       tinCanDataEndpoint: 'http://localhost:8008/wp-json/uncanny_reporting/v1/tincan_data/', // add user id for this

       assignmentDataEndpoint: 'http://localhost:8008/wp-json/uncanny_reporting/v1/assignment_data',


       courseModuleEndpoint: 'http://localhost:8008/wp-json/uncanny_reporting/v1/course_modules',
       coursesOverviewEndpoint: 'http://localhost:8008/wp-json/uncanny_reporting/v1/courses_overview//?group_id=9437',

       groupDashboardEndpoint: 'http://localhost:8008/wp-json/uncanny_reporting/v1/dashboard_data//?group_id=', // add group id
       allGroupDashboardEndpoint: 'http://localhost:8008/wp-json/uncanny_reporting/v1/dashboard_data', // add group id
       usersCompletedCoursesEndpoint: 'http://localhost:8008/wp-json/uncanny_reporting/v1/users_completed_courses//?group_id=', // add group id

  }

export default WPAPI;
