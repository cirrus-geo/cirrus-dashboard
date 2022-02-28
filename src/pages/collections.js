import React from 'react';
import { Router } from '@reach/router';

import CollectionsDetailsPage from 'pages-client/collections/details';

const CollectionsIndex = () => {
  return (
    <>
      <Router basepath="/">
        <CollectionsDetailsPage path="/collections/:collectionsId/:workflowId" />
      </Router>
    </>
  );
};

export default CollectionsIndex;
