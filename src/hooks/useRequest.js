import { useCallback, useState, useEffect } from 'react';
import axios from 'axios';

const defaultState = {
  loading: false,
  error: false
}

const defaultMethod = 'get';

export default function useRequest({ url, method = defaultMethod }) {
  const [response, updateResponse] = useState();
  const [requestState, updateRequestState] = useState(defaultState);

  async function request(options) {
    let response;

    updateRequestState(prev => {
      return {
        ...prev,
        loading: true
      }
    });

    try {
      response = await axios(options);
    } catch(e) {
      updateRequestState(prev => {
        return {
          ...prev,
          loading: false,
          error: true
        }
      });
      throw e;
    }

    updateRequestState(prev => {
      return {
        ...prev,
        loading: false
      }
    });

    return response;
  }

  const memoizedRequest = useCallback(async () => {
    const response = await request({
      url,
      method
    });
    updateResponse(response);
  }, [url, method]);

  useEffect(() => {
    memoizedRequest();
  }, [memoizedRequest]);

  return {
    response,
    state: requestState,
    data: response?.data,
    request: memoizedRequest
  }
}