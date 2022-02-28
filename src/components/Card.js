import React from 'react'
import PropTypes from 'prop-types'

// TODO: Create a way to take in as many lines as needed
const Card = ({className, header, children}) => (
  <div className="card">
    <h3>{header}</h3>
    <p>{children}</p>
  </div>
)

Card.propTypes =  {
  className: PropTypes.string,
  header: PropTypes.string,
  children: PropTypes.string,
}

export default Card