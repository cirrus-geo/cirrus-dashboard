import React, { useState } from 'react';
import PropTypes from 'prop-types';

import LoadingAnimation from './LoadingAnimation';
import MetricsControls from 'components/MetricsControls'

import { friendlyDateWithTime, friendlyDate } from 'lib/datetime';
import {  
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { METRICS_DEFAULT_FILTERS } from 'data/metrics';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Tooltip
);

const LineChart = ({ metrics, loading }) => {
  const [selectedFilters, updateLineChartFilters] = useState(METRICS_DEFAULT_FILTERS);

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

    // Setup datasets for line chart
    var j ;
    for(i=0; i < metricsFilteredData.length; i++){
      for(j=0; j < metricsFilteredData[i].states.length; j++) {
        switch(metricsFilteredData[i].states[j].state) {
          case "COMPLETED":
            completedMetrics.push(metricsFilteredData[i].states[j].unique_count)
            break;
          case "FAILED":
            failedMetrics.push(metricsFilteredData[i].states[j].unique_count)
            break;
          case "ABORTED":
            abortedMetrics.push(metricsFilteredData[i].states[j].unique_count)
            break;
          case "INVALID":
            invalidMetrics.push(metricsFilteredData[i].states[j].unique_count)
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
    updateLineChartFilters({
      label: label,
      value: value
    });
  }

  // Add data for the line chart
  const data = { 
    labels: metricsLabels,
    datasets: [
      {
        label: 'Completed',
        data: completedMetrics,
        backgroundColor: '#6CC24A',
        borderColor: '#6CC24A',
        borderWidth: 2,
      },
      {
        label: 'Failed',
        data: failedMetrics,
        backgroundColor: '#E76464',
        borderColor: '#E76464',
        borderWidth: 2,
      },
      {
        label: 'Aborted',
        data: abortedMetrics,
        backgroundColor: '#5EACCB',
        borderColor: '#5EACCB',
        borderWidth: 2,
      },
      {
        label: 'Invalid',
        data: invalidMetrics,
        backgroundColor: '#EE9D52',
        borderColor: '#EE9D52',
        borderWidth: 2,
      },
    ],
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
    <div className="line-chart">
      
      <div className="header">
        <div className="title">
          <h2>Unique Payloads Processed</h2>
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
          <Line data={data} options={options}  />
        </div>
      ) }

    </div>
  )

}

LineChart.propTypes = {
  metrics: PropTypes.object, 
  loading: PropTypes.bool,
};

export default LineChart;