import React from "react";

class GroupSummary extends React.Component {

    render() {
        let title = "";
        if (this.props.groupInfo.result) {
            const group = this.props.groupInfo.result[0];
            return(
                <div>
                    <h3>Summary</h3>
                    <p className="summary-content">total courses: {group.courses.length}</p>
                    <p className="summary-content">total users: {group.enrolledUsers.length}</p>
                </div>
            );
        }

        return(
            <div></div>
        );
    }
}
export default GroupSummary;
