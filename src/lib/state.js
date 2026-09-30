// Cirrus v2 renamed the v1 "COMPLETED" state to "SUCCEEDED". Both are normalized
// to the v2 name for internal logic, while the API's own term is kept for display.
const STATE_ALIASES = {
  COMPLETED: 'SUCCEEDED'
};

export function normalizeState(state) {
  return STATE_ALIASES[state] || state;
}

// Turns an API state name into a human-friendly label, e.g. COMPLETED -> "Completed".
export function stateLabel(state) {
  if ( typeof state !== 'string' || state.length === 0 ) return state;
  return `${state.charAt(0).toUpperCase()}${state.slice(1).toLowerCase()}`;
}
