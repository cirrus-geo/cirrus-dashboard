import React from 'react';
import PropTypes from 'prop-types';

export default function Modal (props) {
  const { showModal, closeModal, children } = props;

  return (
    <div className={showModal ? "overlay" : "hide"}>
      <div className="modal">
        <h3>Error Details</h3>
        <button className="close" onClick={closeModal}>&#10005;</button>
        <div className="modal__wrapper" >
          <p>{ children }</p>
          <button className="button" onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  )

}

Modal.propTypes = {
  showModal: PropTypes.bool,
  children: PropTypes.string,
  closeModal: PropTypes.func,
};
