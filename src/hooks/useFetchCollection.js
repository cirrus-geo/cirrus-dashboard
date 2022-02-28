import { useRequest } from 'hooks';

import { COLLECTION_STATES } from 'data/collections';

const errorBase = 'Failed to fetch collection';

export default function useFetchCollection({ href, since = 'all' }) {
  const params = [];
  let url;

  if ( href ) {
    url = href;
  } else {
    throw new Error(`${errorBase}: Unknown collection origin`);
  }

  if ( since !== 'all' ) {
    params.push(`since=${since}`);
  }

  if ( params.length > 0 ) {
    url = `${url}?${params.join('&')}`;
  }

  const { state, data = {} } = useRequest({
    url
  });

  const { counts = {} } = data;

  const collectionData = {
    ...data,
    counts: {}
  };

  Object.keys(counts).forEach(key => {
    const mapping = COLLECTION_STATES.find(({ id } = {}) => id === key);

    collectionData.counts[key] = {
      ...mapping,
      count: counts[key]
    }
  });

  return {
    state,
    data: collectionData
  }
}
