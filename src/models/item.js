import { friendlyDate } from 'lib/datetime';

class Item {
  constructor(data) {
    this.catid = data.catid;
    this.created = data.created;
    this.updated = data.updated;
    this.state = data.state;
    this.executions = data.executions;
  }

  get itemId() {
    const split = this.catid && this.catid.split('/');
    return split[split.length - 1];
  }

  get createdFriendly() {
    return friendlyDate(this.created);
  }

  get updatedFriendly() {
    return friendlyDate(this.updated);
  }

  get lastExecution() {
    return Array.isArray(this.executions) && this.executions[this.executions.length - 1];
  }

}

export default Item;