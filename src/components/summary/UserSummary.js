import React from "react";

class UserSummary extends React.Component {
    render() {
        if (Object.keys(this.props.userInfo).length > 0) {
            return(
                <div>
                    <h3>{this.props.userInfo.username} Profile</h3>
                    <p className="summary-content">ID: {this.props.userInfo.id}</p>
                    <p className="summary-content">email: {this.props.userInfo.email}</p>
                    <p className="summary-content">name: {this.props.userInfo.firstName} {this.props.userInfo.lastName}</p>
                </div>
            );
        }

        return(
            <h3></h3>
        );
    }
}
export default UserSummary;
