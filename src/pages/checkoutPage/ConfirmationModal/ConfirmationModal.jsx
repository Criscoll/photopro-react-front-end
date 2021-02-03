import React from 'react';
import ReactDom from 'react-dom';
import './ConfirmationModal.css';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

export default function CheckoutConfirmationModal(props) {
  const history = useHistory();
  if (!props.isOpen) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="overlay-styles" />
        <div className="confirmation-modal">
          <h3>
            You order has been approved! Please visit 'My Purchases' in your
            profile tab to download.
          </h3>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              history.replace('/');
            }}
          >
            Return to Main Page
          </Button>
        </div>
      </React.Fragment>,
      document.getElementById('portal')
    );
  }
}
