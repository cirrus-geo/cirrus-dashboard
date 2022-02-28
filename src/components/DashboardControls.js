import React from 'react';
import { Select, MenuItem, InputLabel } from '@material-ui/core';


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
          <InputLabel id="dashboard-controls-since">Results Since:</InputLabel>
          <Select
            labelId="dashboard-controls-since"
            value={since}
            onChange={handleOnSinceChange}
          >
            {DASHBOARD_FILTERS_SINCE.map(({label, value} = {}) => {
              return (
                <MenuItem key={value} value={value}>{ label }</MenuItem>
              )
            })}
          </Select>
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

export default DashboardControls;