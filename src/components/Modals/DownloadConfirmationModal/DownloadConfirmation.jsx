import React from 'react';
import ReactDom from 'react-dom';
import './DownloadConfirmation.css';

export default function AddedToCartModal(props) {
  if (!props.openModal) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="download-confirmation-overlay" />
        <div
          className="download-confirmation-modal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h3>
            Your photo is currently being downloaded. Please check your
            computers Downloads folder to see your unwatermarked photo!
          </h3>
        </div>
      </React.Fragment>,
      document.getElementById('confirmationPortal3')
    );
  }
}
