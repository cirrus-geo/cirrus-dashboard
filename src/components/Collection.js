import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby';
import numeral from 'numeral';
import PieChart from './PieChart';

import { useFetchCollection } from 'hooks';

import { COLLECTION_STATES } from 'data/collections';

// This creates a block of cells that allow us to fill the content
// to create a loading state

const loadingCells = [...new Array(COLLECTION_STATES.length)].map((item, i) => {
  return {
    id: `loading-${i}`,
    label: 'Loading',
    value: 0
  }
});

const ContentNotActive = () => (
  <div className="collection-not-active">
    <p className="text-center">
      Data Not Available
    </p>
  </div>
);

const Collection = ({ collection, since, type }) => {
  let collectionClass = 'collection';

  const { title, href } = collection;

  const { data = {}, state = {} } = useFetchCollection({
    href,
    since,
    type
  });

  const { counts, collections, workflow } = data;
  const { loading = true } = state;

  let cells;

  if ( loading ) {
    cells = loadingCells;
  } else {
    cells = Object.keys(counts).map(key => {
      const { id, label, count } = counts[key];
      return {
        id,
        label,
        value: count
      }
    });
  }

  const hasCells = Array.isArray(cells) && cells.length > 0;

  if ( loading ) {
    collectionClass = `${collectionClass} collection-is-loading`;
  }

  const pieChartData = [];

  return (
    <section className={collectionClass}>
      <div className="collection-heading">
        <div>
          <h2 className="collection-title">
            <Link to={`/collections/${collections}/${workflow}`}>
              { title }
            </Link>
          </h2>
        </div>
        <div>
          <Link to={`/collections/${collections}/${workflow}`} className="button">
            View Details
          </Link>
        </div>
      </div>
      <div className="collection-dashboard">
        <div className="collection-metrics">
          { !hasCells && <ContentNotActive /> }
          { hasCells && (
            <ul className="collection-cells">
              { cells.map(({ id, label, value } = {}) => {
                let number = value;

                if ( value > 999 ) {
                  number = numeral(value).format('0,0'); /* add commas to numbers */
                }

                if ( !Number.isInteger(value) ) {
                  value = Number(value.substr(0, value.length - 1)); /* remove + character at the end of largest number for pie chart */
                }

                if ( id === "COMPLETED" ) {
                  pieChartData.push(value);
                }
                if ( id === "FAILED" ) {
                  pieChartData.push(value);
                }

                return (
                  <li key={id} className="collection-cell">
                    <h3 className="collection-cell-header">
                      { label }
                    </h3>
                    <p className="collection-cell-value">
                      { number }
                    </p>
                  </li>
                );  

              }) }
            </ul>
          )}
          <ul className="collection-meta">
            <li>
              <p>
                Results from {since && since !== 'all' ? `the last ${since}` : 'all time' }
              </p>
            </li>
          </ul>
        </div>
        <div className="pie-chart">
          <PieChart cellData={ pieChartData } />
        </div>
    </div>
    </section>
  );
}

Collection.propTypes = {
  cells: PropTypes.array,
  since: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string,
  href: PropTypes.string,
  collection: PropTypes.object
}

export default Collection