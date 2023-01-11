import { useEffect, useState } from 'react';

import { useRequest } from 'hooks';
import Item from 'models/item';

import { DASHBOARD_COLLECTION_STATES_DEFAULT, DASHBOARD_FILTERS_SINCE_DEFAULT } from 'data/dashboard';

const DEFAULT_PARAMS = {
  since: undefined,
  state: undefined,
  nextkey: undefined
}

export default function useFetchCollectionItems({
  collectionsId,
  workflowId,
  since = DASHBOARD_FILTERS_SINCE_DEFAULT.value,
  state = DASHBOARD_COLLECTION_STATES_DEFAULT.value
}) {
  const [params, updateParams] = useState({
    ...DEFAULT_PARAMS,
    since,
    state,
  });

  
  // Construct the endpoint we'll use for requests

  const paramsToAdd = [];
  let url = `${process.env.CIRRUS_API_ENDPOINT}/${collectionsId}/workflow-${workflowId}/items`;

  if ( params?.nextkey ) {
    paramsToAdd.push(`nextkey=${params.nextkey}`);
  }

  if ( params?.since !== 'all' ) {
    paramsToAdd.push(`since=${params.since}`);
  }

  if ( params?.state !== 'ALL' ) {
    paramsToAdd.push(`state=${params.state}`);
  }

  if ( paramsToAdd.length > 0 ) {
    url = `${url}?${paramsToAdd.join('&')}`;
  }

  // Make the request
  const { state: requestState, data: requestData = {} } = useRequest({
    url
  });

  const { nextkey: requestNextKey, items: requestItems } = requestData;
  const hasRequestItems = Array.isArray(requestItems) && requestItems.length > 0;

  // Store and collect the data from the request

  const [collectionData, updateCollectionData] = useState({});

  let { items } = collectionData || {};

  items = items && items.map(item => new Item(item));

  // If any of the configurable params change, we need to refresh our state so that
  // we're not using stale data

  useEffect(() => {
    updateCollectionData({});
    updateParams({
      ...DEFAULT_PARAMS,
      since,
      state
    });
  }, [since, state]);

  // If our nextkey or items change at any time, we want to update our state to include
  // those new items

  useEffect(() => {
    updateCollectionData((prev = {}) => {
      const isNewKey = requestNextKey !== prev.nextkey;
      let newItems = [
        ...(prev.items || [])
      ];

      // If we don't have the same key, that means we have a new set of data. Append
      // any new items to our item state

      if ( isNewKey && hasRequestItems ) {
        newItems = [
          ...newItems,
          ...requestItems
        ]
      } else if ( !requestNextKey && hasRequestItems ) {
        newItems = [
          ...requestItems
        ]
      }

      return {
        ...prev,
        nextkey: requestNextKey,
        items: newItems
      }
    });
  }, [requestNextKey, requestItems, hasRequestItems])

  /**
   * handleLoadMore
   * @description Updates the params to use a nextkey to fetch the next page
   */

  function handleLoadMore() {
    updateParams(prev => {
      return {
        ...prev,
        nextkey: requestData?.nextkey
      }
    })
  }

  return {
    state: requestState,
    data: {
      ...requestData,
      items
    },
    loadMore: requestData?.nextkey && handleLoadMore
  }
}
