import { useRequest } from 'hooks';

const CIRRUS_ENDPOINT = process.env.CIRRUS_API_ENDPOINT;

export default function useFetchCollections() {
  const { state, data = {} } = useRequest({
    url: CIRRUS_ENDPOINT
  });

  const collections = data?.links?.filter(({ rel }) => rel === 'child');

  return {
    state,
    collections
  }
}
