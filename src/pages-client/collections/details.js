import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';
import { FaChevronLeft } from 'react-icons/fa';

import { useFetchCollectionItems } from 'hooks';

import Layout from 'components/Layout';
import Dashboard from 'components/Dashboard';
import DashboardControls from 'components/DashboardControls';
import DataTable from 'components/DataTable';
import Breadcrumbs from 'components/Breadcrumbs';
import Modal from 'components/Modal';
import LoadingAnimation from '../../components/LoadingAnimation';

import { DASHBOARD_DEFAULT_FILTERS, DASHBOARD_COLLECTION_STATES, DASHBOARD_COLLECTION_STATES_DEFAULT } from 'data/dashboard';

const DEFAULT_COLLECTION_FILTERS = {
  ...DASHBOARD_DEFAULT_FILTERS,
  state: DASHBOARD_COLLECTION_STATES_DEFAULT.id
}

const CollectionsDetailsPage = ({ collectionsId, workflowId }) => {

  const [showModal, setShowModal] = useState(false);
  const [children, setChildren] = useState("");

  function openModal(text) {
    setChildren(text);
    setShowModal(true);
  }

  function closeModal() {
    setChildren("");
    setShowModal(false);
  }

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
      Header: 'Date Created',
      minWidth: 200,
      width: 180,
    },
    {
      key: 'updatedFriendly',
      Header: 'Date Updated',
      minWidth: 200,
      width: 180,
    },
    {
      key: 'state',
      Header: 'State',
      Cell: (item) => {
        const { state } = item;
        return <span className={`step ${ state }`}>{ state }</span>
      }
    },
    {
      key: 'last_error',
      Header: 'Error',
      minWidth: 200,
      width: 180,
      Cell: (item) => {
        const { last_error } = item;
        if ( item.state === "FAILED" || item.state === "INVALID" ) {
          return (
            <>
              <span className="last_error">
                {last_error.substring(0, 80)} {last_error.length >= 80 && <span>...<button className="view-error" onClick={() => openModal(`${last_error}`)}>View Full Error</button></span> }
              </span> 
            </>
          ) }  
      }
    },
    {
      key: 'actions',
      Header: ' ',
      Cell: (item) => {
        const { lastExecution } = item;
        return <a href={ lastExecution } target="_blank" rel="noreferrer" className="view-last-execution"><span data-text="View last execution" className="tooltip">View <span className="icon-arrow-top-right"></span></span></a>
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
        <title>Workflow: { collectionsId } - {workflowId}</title>
      </Helmet>
      <Dashboard>
        
        <Breadcrumbs crumbs={[
          {
            Crumb: () => {
              return (
                <Link to="/workflows">
                  <FaChevronLeft /> <span>Back</span>
                </Link>
              );
            }
          }
        ]} />
        <div className="collections-heading">
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
                    <label id="dashboard-controls-state">State:</label>
                    <select
                      id="dashboard-controls-state"
                      value={filters.state}
                      onChange={handleOnChangeState}
                    >
                      {DASHBOARD_COLLECTION_STATES.map(({label, id} = {}) => {
                        return (
                          <option key={id} value={id}>{ label }</option>
                        )
                      })}
                    </select>
                  </>
                )
              }
            }
          ]} />
        </div>

        <DataTable rows={rows || []} columns={columns} />

        { loading && !hasItems && (
          <div className="text-center center">
            <LoadingAnimation />
          </div>
        ) }

        { !loading && !hasItems && (
          <p className="text-center">
            No Items
          </p>
        ) }

        {canLoadMore && (
          <p className="text-center">
            <button color="primary" onClick={loadMore} disabled={loading}>Load More Results</button>
          </p>
        )}
      </Dashboard>

      <Modal closeModal={closeModal} showModal={showModal}>
        {children} 
      </Modal>

    </Layout>
  );
};

CollectionsDetailsPage.propTypes = {
  collectionsId: PropTypes.string,
  workflowId: PropTypes.string,
};

export default CollectionsDetailsPage;
