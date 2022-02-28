import { COLLECTION_STATES } from 'data/collections';

export const DASHBOARD_FILTERS_SINCE = [
  {
    label: 'All Time',
    value: 'all',
    isDefault: true
  },
  {
    label: 'Last Hour',
    value: '1h'
  },
  {
    label: 'Last Day',
    value: '1d'
  },
  {
    label: 'Last Week',
    value: '7d'
  },
  {
    label: 'Last Month',
    value: '30d'
  },
  {
    label: 'Last Year',
    value: '365d'
  }
];

export const DASHBOARD_FILTERS_SINCE_DEFAULT = DASHBOARD_FILTERS_SINCE.find(({ isDefault }) => isDefault);

export const DASHBOARD_DEFAULT_FILTERS = {
  since: DASHBOARD_FILTERS_SINCE_DEFAULT?.value
}

export const DASHBOARD_COLLECTION_STATES = [
  {
    id: 'ALL',
    label: 'All',
    isDefault: true
  },
  ...COLLECTION_STATES
];

export const DASHBOARD_COLLECTION_STATES_DEFAULT = DASHBOARD_COLLECTION_STATES.find(({ isDefault }) => isDefault);