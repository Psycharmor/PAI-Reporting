import React, { Component } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import TableEntry from './TableEntry'

class ActivityTable extends Component {

    render() {
        const activities = this.props.activities.map((item, key) => {
            // let completed = "no";
            // if (item.activity.timestamps_formatted.completed) {
            //     completed = "yes";
            // }
            // return <li key={key}>Name: {item.first_name} {item.last_name}; course id: {item.activity.id} date completed: {completed}</li>
            return <TableEntry key={key} activity={item}></TableEntry>
        });

        return (
            <div>
                <ul className="table-list">
                    <li className="table-entry">
                        <div className="table-entry-header label">
                            <div>Name</div>
                            <div>Course ID</div>
                            <div>Completed?</div>
                        </div>
                    </li>
                    <LoadingOverlay active={this.props.showOverlay}>
                        {activities}
                    </LoadingOverlay>
                </ul>
            </div>
        )
    }
}
export default ActivityTable;
