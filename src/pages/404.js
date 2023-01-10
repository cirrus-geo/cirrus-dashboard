import React from 'react';

import Layout from 'components/Layout';

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="dashboard">
        <h1>Page Not Found</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      </div>
    </Layout>
  );
}

export default NotFoundPage
