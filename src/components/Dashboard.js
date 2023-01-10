import React from 'react';
import PropTypes from 'prop-types';

const Dashboard = ({ children }) => {
  return (
    <div className="dashboard">
      { children }
    </div>
  )
}

Dashboard.propTypes = {
  children: PropTypes.node,
};

export default Dashboard;