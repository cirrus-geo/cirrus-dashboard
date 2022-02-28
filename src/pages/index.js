import React, { useState } from 'react';

import { useFetchCollections } from 'hooks';

import Dashboard from 'components/Dashboard'
import DashboardControls from 'components/DashboardControls'
import Collection from 'components/Collection'
import Layout from 'components/Layout';

import { DASHBOARD_DEFAULT_FILTERS } from 'data/dashboard';

const IndexPage = () => {
  const [filters, updateFilters] = useState(DASHBOARD_DEFAULT_FILTERS);

  const { collections = [] } = useFetchCollections();

  function handleOnFilter({ filters: updatedFilters }) {
    updateFilters(updatedFilters);
  }

  return (
    <Layout pageName="home">
      <Dashboard>
        <DashboardControls filters={filters} onFilter={handleOnFilter} />
        { collections && collections.map((collection = {}) => {
          return <Collection key={collection.href} collection={collection} since={filters?.since} type="output_collections" />
        })}
      </Dashboard>
    </Layout>
  );
};

export default IndexPage;
