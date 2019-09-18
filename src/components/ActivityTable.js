import React, { Component } from 'react';
import LoadingOverlay from 'react-loading-overlay';

class ActivityTable extends Component {

    render() {
        const activities = this.props.activities.map((item, key) =>
            <li key={key}>Name: {item.first_name} {item.last_name}; course id: {item.activity.id}</li>
        );

        return (
            <div>
                <LoadingOverlay active={this.props.showOverlay}>
                <ul>
                    {activities}
                </ul>
                </LoadingOverlay>
            </div>
        )
    }
}
export default ActivityTable;
