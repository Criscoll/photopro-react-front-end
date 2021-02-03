import React from 'react';
import ReactDom from 'react-dom';
import './PostConfirmationModal.css';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

export default function PostConfirmationModal(props) {
  const history = useHistory();
  if (!props.isOpen) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="overlay-styles" />
        <div className="confirmation-modal">
          <h3>
            You post has been uploaded successfully! Please check your profile
            page under the profile tab to see your uploads.
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
