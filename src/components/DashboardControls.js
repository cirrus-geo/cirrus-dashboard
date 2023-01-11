import React from 'react';
import PropTypes from 'prop-types';

import { DASHBOARD_FILTERS_SINCE, DASHBOARD_DEFAULT_FILTERS } from 'data/dashboard';

const DashboardControls = ({ additionalControls = [], filters = DASHBOARD_DEFAULT_FILTERS, onFilter }) => {
  const { since } = filters;

  /**
   * handleOnSinceChange
   */

  function handleOnSinceChange(event) {
    const { target = {} } = event;
    const value = target.value;

    if ( typeof onFilter === 'function' ) {
      onFilter({
        filters: {
          since: value
        },
        event
      });
    }
  }

  return (
    <div className="dashboard-controls">
      <ul>
        <li className="dashboard-controls-control">
          <label htmlFor="dashboard-controls-since">Results Since:</label>
          <select
            id="dashboard-controls-since"
            // eslint-disable-next-line react/no-unknown-property
            variant="filled"
            className="select"
            value={since}
            onChange={handleOnSinceChange}
          >
            {DASHBOARD_FILTERS_SINCE.map(({label, value} = {}) => {
              return (
                <option key={value} value={value}>{ label }</option>
              )
            })}
          </select>
        </li>
        {additionalControls.map(control => {
          const { id, Control } = control;
          return (
            <li key={id} className={`dashboard-controls-control dashboard-controls-${id}`}>
              <Control />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

DashboardControls.propTypes = {
  additionalControls: PropTypes.array,
  onFilter: PropTypes.func,
  filters: PropTypes.object
}

export default DashboardControls;