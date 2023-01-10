import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import 'assets/stylesheets/application.scss';

import SideBar from 'components/SideBar';

const Layout = ({ children, pageName }) => {

  let className = '';

  if ( pageName ) {
    className = `${className} page-${pageName}`;
  }

  return (
    <>
      <Helmet bodyAttributes={{ class: className}}>
        <title>FilmDrop Dashboard</title>
        <link rel="shortcut icon" type="image/png" id="favicon" href="/filmdrop-icon.png" />
      </Helmet>

      <div className="wrapper">
        <SideBar />
        <main>{ children }</main>
      </div>
    </>
  );

};

Layout.propTypes = {
  children: PropTypes.node,
  pageName: PropTypes.string,
}

export default Layout;