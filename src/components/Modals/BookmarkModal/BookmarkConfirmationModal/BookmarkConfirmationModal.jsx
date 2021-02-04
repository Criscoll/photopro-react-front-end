import React from 'react';
import ReactDom from 'react-dom';
import './BookmarkConfirmationModal.css';

export default function BookmarkConfirmationModal(props) {
  console.log('tesst');
  if (!props.openModal) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="bookmark-confirmation-overlay" />
        <div
          className="bookmark-confirmation-modal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h3>Photo has successfully been added to this collection!</h3>
        </div>
      </React.Fragment>,
      document.getElementById('confirmationPortal2')
    );
  }
}
