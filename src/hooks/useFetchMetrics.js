import { useRequest } from 'hooks';

const METRICS_ENDPOINT = process.env.METRICS_API_ENDPOINT;

export default function useFetchMetrics() {

  const { state, data = {} } = useRequest({
    url: METRICS_ENDPOINT
  });
  
  const metrics = data?.state_transitions;

  return {
    state,
    metrics
  }
  
}
