import React from 'react';
import ReactDom from 'react-dom';
import './AddedToCartModal.css';

export default function AddedToCartModal(props) {
  if (!props.openModal) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="cart-confirmation-overlay" />
        <div
          className="cart-confirmation-modal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {props.cartStatus === 'added' ? (
            <h3>Photo has been added to the cart</h3>
          ) : (
            <h3>Photo has been removed from the cart</h3>
          )}
        </div>
      </React.Fragment>,
      document.getElementById('confirmationPortal3')
    );
  }
}
