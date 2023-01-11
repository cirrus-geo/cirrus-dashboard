import React, { useState } from 'react';
import PropTypes from 'prop-types';

import LoadingAnimation from './LoadingAnimation';
import MetricsControls from 'components/MetricsControls'

import { friendlyDateWithTime, friendlyDate } from 'lib/datetime';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { METRICS_DEFAULT_FILTERS } from 'data/metrics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
);
  
const BarChart = ({ metrics, loading }) => {
  const [selectedFilters, updateBarChartFilters] = useState(METRICS_DEFAULT_FILTERS);

  let metricsFilteredData = [];
  const metricsLabels = [];
  const completedMetrics = [];
  const failedMetrics = [];
  const abortedMetrics = [];
  const invalidMetrics = [];

  // Setup data for charts to digest
  function handleDataChange() {

    // Setup different data filter sets
    var metricsData = {
      'daily' : () => { return metrics.daily; },
      'hourly': () => { return metrics.hourly; },
      'hourly_rolling': () => { return metrics.hourly_rolling; }
    };
    metricsFilteredData = metricsData[selectedFilters.value]().slice(-45); // grab the last 45 items

    // Sort the data in ascending order
    metricsFilteredData.sort(function(a, b) {
      var keyA = new Date(a.period),
        keyB = new Date(b.period);
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });

    // Setup labels and format dates
    var i ;
    if (selectedFilters.value === "daily") {
      for(i=0; i < metricsFilteredData.length; i++){
        metricsLabels.push(friendlyDate(`${metricsFilteredData[i].period}`));
      }
    } else {
      for(i=0; i < metricsFilteredData.length; i++){
        metricsLabels.push(friendlyDateWithTime(`${metricsFilteredData[i].period}`));
      }
    }
  
    // Setup datasets for chart
    var j ;
    for(i=0; i < metricsFilteredData.length; i++){
      for(j=0; j < metricsFilteredData[i].states.length; j++) {
        switch(metricsFilteredData[i].states[j].state) {
          case "COMPLETED":
            completedMetrics.push(metricsFilteredData[i].states[j].count)
            break;
          case "FAILED":
            failedMetrics.push(metricsFilteredData[i].states[j].count)
            break;
          case "ABORTED":
            abortedMetrics.push(metricsFilteredData[i].states[j].count)
            break;
          case "INVALID":
            invalidMetrics.push(metricsFilteredData[i].states[j].count)
            break;
          default: 
            break;
        }
      }
    }
  }

  // Check if our data is in
  const hasItems = Object.keys(metrics).length > 0;
  if (!loading && hasItems) {
    handleDataChange(selectedFilters.value);
  }

  // Update filters when selected from chart (daily, hourly, hourly_rolling)
  function handleOnChangeState(filters) {
    const { label, value } = filters;
    updateBarChartFilters({
      label: label,
      value: value
    });
  }

  // Add data for the bar chart
  const data = { 
    labels: metricsLabels,
    datasets: [
      {
        label: 'Invalid',
        data: invalidMetrics,
        backgroundColor: '#EE9D52',
        stack: 'Stack 0',
      },
      {
        label: 'Aborted',
        data: abortedMetrics,
        backgroundColor: '#5EACCB',
        stack: 'Stack 0',
      },
      {
        label: 'Failed',
        data: failedMetrics,
        backgroundColor: '#E76464',
        stack: 'Stack 0',
      },
      {
        label: 'Completed',
        data: completedMetrics,
        backgroundColor: '#6CC24A',
        stack: 'Stack 0',
      },
    ]
  };
  let delayed;
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default' && !delayed) {
          delay = context.dataIndex * 5 + context.datasetIndex * 10;
        }
        return delay;
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false,
          maxRotation: 90
        }
      },
      y: {
        grid: {
          display: true,
          color: '#353D4F',
          borderWidth: 2,
          borderColor: '#353D4F'
        },
      }
    },
    plugins: {
      legend: {
        display: false,
      },
    }
  }

  return (
    <div className="bar-chart">
      
      <div className="header">
        <div className="title">
          <h2>Non-Unique Payloads Processed</h2>
          { !loading && hasItems && (
            <ul className="legend">
              <li><span className="legend bg-green"></span> Completed</li>
              <li><span className="legend bg-red"></span> Failed</li>
              <li><span className="legend bg-blue"></span> Aborted</li>
              <li><span className="legend bg-orange"></span> Invalid</li>
            </ul>
          ) }
        </div>
        { !loading && hasItems && (
          <MetricsControls onFilter={handleOnChangeState} selectedFilters={selectedFilters} />
        ) }
        </div>

      { loading && !hasItems && (
        <div className="text-center center">
          <LoadingAnimation />
        </div>
      ) }

      { !loading && !hasItems && (
        <p className="text-center">
          <em>Workflow state change metrics are not enabled.</em>
        </p>
      ) }

      { !loading && hasItems && (
        <div className="chart__wrapper">
          <Bar data={data} options={options}   />
        </div>
      ) }

    </div>
  )

}

BarChart.propTypes = {
  metrics: PropTypes.object, 
  loading: PropTypes.bool,
};

export default BarChart;