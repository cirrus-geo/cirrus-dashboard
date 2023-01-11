import React from 'react';
import PropTypes from 'prop-types'
import { Link } from 'gatsby';

const Breadcrumbs = ({ crumbs }) => {
  const hasCrumbs = Array.isArray(crumbs) && crumbs.length > 0;

  if ( !hasCrumbs ) return null;

  return (
    <ul className="breadcrumbs">
      {crumbs.map((crumb, index) => {
        const { to, label, iconBefore, iconAfter, Crumb } = crumb;
        let component;

        if ( Crumb ) {
          component = <Crumb />;
        } else {
          component = (
            <Link to={to}>
              { iconBefore } <span>{ label }</span> { iconAfter }
            </Link>
          );
        }

        return (
          <li key={index}>
            { component }
          </li>
        )
      })}
    </ul>
  )
}

Breadcrumbs.propTypes =  {
  crumbs: PropTypes.array,
  length: PropTypes.number,
  map: PropTypes.func
}

export default Breadcrumbs;