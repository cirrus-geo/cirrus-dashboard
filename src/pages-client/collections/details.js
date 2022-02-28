import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';
import { Select, MenuItem, InputLabel, Button } from '@material-ui/core';
import { FaChevronLeft } from 'react-icons/fa';

import { useFetchCollectionItems } from 'hooks';

import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import DashboardControls from 'components/DashboardControls';
import DataTable from 'components/DataTable';
import Breadcrumbs from 'components/Breadcrumbs';

import { DASHBOARD_DEFAULT_FILTERS, DASHBOARD_COLLECTION_STATES, DASHBOARD_COLLECTION_STATES_DEFAULT } from 'data/dashboard';

const DEFAULT_COLLECTION_FILTERS = {
  ...DASHBOARD_DEFAULT_FILTERS,
  state: DASHBOARD_COLLECTION_STATES_DEFAULT.id
}

const CollectionsDetailsPage = ({ collectionsId, workflowId }) => {

  const [filters, updateFilters] = useState(DEFAULT_COLLECTION_FILTERS);
  const { state, since } = filters;

  const { data = {}, state: requestState, loadMore } = useFetchCollectionItems({
    collectionsId,
    workflowId,
    since,
    state
  });
  const { items } = data;
  const { loading } = requestState;

  const hasItems = Array.isArray(items) && items.length > 0;
  const canLoadMore = typeof loadMore === 'function';

  const columns = [
    {
      key: 'itemId',
      Header: 'Item ID'
    },
    {
      key: 'createdFriendly',
      Header: 'Date Created'
    },
    {
      key: 'updatedFriendly',
      Header: 'Date Updated'
    },
    {
      key: 'state',
      Header: 'State'
    },
    {
      key: 'actions',
      Header: ' ',
      Cell: (item) => {
        const { lastExecution } = item;
        return <a href={ lastExecution } target="_blank" rel="noreferrer">Last Execution</a>
      }
    }
  ]

  const rows = Array.isArray(items) && items.map(item => {
    return columns.map(({ key, Cell }) => {
      if ( Cell ) return Cell(item);
      return item[key];
    })
  });

  function handleOnFilter({ filters: updatedFilters }) {
    updateFilters(prev => {
      return {
        ...prev,
        ...updatedFilters
      }
    });
  }

  function handleOnChangeState({ target = {} }) {
    const { value } = target;
    handleOnFilter({
      filters: {
        state: value
      }
    });
  }

  return (
    <Layout pageName="collections-details">
      <Helmet>
        <title>{ collectionsId } - {workflowId}</title>
      </Helmet>
      <Dashboard>
        <Breadcrumbs crumbs={[
          {
            Crumb: () => {
              return (
                <Link to="/">
                  <FaChevronLeft /> <span>Back to All Collections</span>
                </Link>
              );
            }
          }
        ]} />
        <div className="collections-details-header">
          <h1>{ collectionsId }</h1>
          <p>
            Workflow: {workflowId}
          </p>
        </div>
        <DashboardControls filters={filters} onFilter={handleOnFilter} additionalControls={[
          {
            id: 'state',
            Control: () => {
              return (
                <>
                  <InputLabel id="dashboard-controls-state">State:</InputLabel>
                  <Select
                    labelId="dashboard-controls-state"
                    id="dashboard-controls-state"
                    value={filters.state}
                    onChange={handleOnChangeState}
                  >
                    {DASHBOARD_COLLECTION_STATES.map(({label, id} = {}) => {
                      return (
                        <MenuItem key={id} value={id}>{ label }</MenuItem>
                      )
                    })}
                  </Select>
                </>
              )
            }
          }
        ]} />

        <DataTable rows={rows || []} columns={columns} />

        { loading && !hasItems && (
          <p className="text-center">
            Loading
          </p>
        ) }

        { !loading && !hasItems && (
          <p className="text-center">
            No Items
          </p>
        ) }

        {canLoadMore && (
          <p className="text-center">
            <Button variant="contained" color="primary" onClick={loadMore} disabled={loading}>Load More Results</Button>
          </p>
        )}
      </Dashboard>

    </Layout>
  );
};

export default CollectionsDetailsPage;
