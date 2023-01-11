import React from 'react';
import PropTypes from 'prop-types';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend
);

const PieChart = ({cellData}) => {

  const data = {
    labels: ['Completed', 'Failed'],
    datasets: [
      {
        data: cellData,
        backgroundColor: [
          '#6CC24A',
          '#E76464',
        ],
        borderWidth: 0,
      },
    ],
  };

  return <Pie data={data} />;
}

PieChart.propTypes = {
  cellData: PropTypes.array
};

export default PieChart;