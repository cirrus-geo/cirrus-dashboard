import { friendlyDateWithTime } from 'lib/datetime';
import { normalizeState, stateLabel } from 'lib/state';

class Item {
  constructor(data) {
    this.catid = data.catid;
    this.created = data.created;
    this.updated = data.updated;
    this.state = normalizeState(data.state);
    this.stateLabel = stateLabel(data.state);
    this.executions = data.executions;
    this.last_error = data.last_error;
  }

  get itemId() {
    const split = this.catid && this.catid.split('/');
    return split[split.length - 1];
  }

  get createdFriendly() {
    return friendlyDateWithTime(this.created);
  }

  get updatedFriendly() {
    return friendlyDateWithTime(this.updated);
  }

  get lastExecution() {
    return Array.isArray(this.executions) && this.executions[this.executions.length - 1];
  }

}

export default Item;