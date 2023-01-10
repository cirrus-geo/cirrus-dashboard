import React, { useState } from 'react';

import { useFetchCollections } from 'hooks';

import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import DashboardControls from 'components/DashboardControls';
import Collection from 'components/Collection';
import LoadingAnimation from '../components/LoadingAnimation';

import { DASHBOARD_DEFAULT_FILTERS } from 'data/dashboard';

const WorkflowPage = () => {
  const [filters, updateFilters] = useState(DASHBOARD_DEFAULT_FILTERS);

  const { collections = [], state: requestState } = useFetchCollections();
  const { loading = true } = requestState;

  function handleOnFilter({ filters: updatedFilters }) {
    updateFilters(updatedFilters);
  }

  return (
    <Layout pageName="home">
      <Dashboard>

        <div className="dashboard-header">
          <h1>All Workflows</h1>
          { !loading && collections.length > 0 && (
            <DashboardControls filters={filters} onFilter={handleOnFilter} />
          )}
        </div>

        { loading && (
          <div className="text-center center" style={{paddingTop: '15%'}} >
            <LoadingAnimation />
          </div>
        ) }

        { !loading && collections.length === 0 && (
          <div className="pa6">
            <p>
              No collections found.
            </p>
          </div>
        )}

        { !loading && collections.length > 0 && collections.map((collection = {}) => {
          return <Collection key={collection.href} collection={collection} since={filters?.since} type="output_collections" />
        })}

      </Dashboard>
    </Layout>
  );
};

export default WorkflowPage;
