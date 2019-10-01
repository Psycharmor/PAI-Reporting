import React from "react";

class CourseSummary extends React.Component {
    render() {
        if (Object.keys(this.props.courseInfo).length > 0) {
            return(
                <h3>{this.props.courseInfo.title} summary</h3>
            );
        }

        return(
            <h3></h3>
        );
    }
}
export default CourseSummary;
