import React from 'react';
import ReactDom from 'react-dom';
import './PhotoModal.css';

export default function PhotoModal(props) {
  if (!props.openModal) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="photo-modal-overlay" />
        <div
          className="photo-modal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <img
            className="photo-modal-image"
            src={`data:image/jpg;base64,${props.image}`}
            alt={props.caption}
          />
        </div>
      </React.Fragment>,
      document.getElementById('portal')
    );
  }
}
