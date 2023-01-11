import React from 'react';
import { Link } from 'gatsby';

import Logo from '../assets/images/svg/logo.inline.svg';

const SideBar = () => {

  let collectionsActive;
  const url = typeof window !== 'undefined' ? window.location.href : '';
  if (url.toString().includes("collections")) {
    collectionsActive = "active";
  }
  
  return (
    <nav>
      <Link to="/" className="site-link">
        <Logo />
        <div className="site-title"><strong>FilmDrop</strong><br/>Dashboard</div>
      </Link>
      <Link to="/" className="page-link" activeClassName="active"><span className="icon-metrics"></span> Metrics</Link>
      <Link to="/workflows" className={`page-link ${collectionsActive}`} activeClassName="active"><span className="icon-workflow"></span> Workflows</Link>
    </nav>
  );
};
  
export default SideBar;