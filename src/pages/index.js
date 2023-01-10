import React from 'react';

import { useFetchMetrics } from 'hooks';

import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard'
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';

const IndexPage = () => {

  // Fetch metrics data from API
  const { metrics = [], state: requestState, } = useFetchMetrics();
  const { loading = true } = requestState;

  return (
    <Layout pageName="home">

      <Dashboard>
        <h1>Metrics</h1>
        <LineChart metrics={metrics} loading={loading} />
        <BarChart metrics={metrics} loading={loading} />
      </Dashboard>
      
    </Layout>
  );
};

export default IndexPage;
