import React, { useState } from 'react';
import axios from 'axios';
import ReactDom from 'react-dom';
import './DeleteAccountModal.css';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 'ch',
    },
  },
}));

export default function DeleteAccountModal(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showButtons, setShowButtons] = useState(true);
  const [credentialsValidated, setCredentialsValidated] = useState('');

  const history = useHistory();
  const classes = useStyles();

  const handleDeleteAccountClickedApi = () => {
    axios({
      method: 'POST',
      url: 'http://localhost:5000/delete_user',
      params: {
        email: email,
        password: password,
      },
    }).then((response) => {
      console.log(response);
      if (response.data.result !== false) {
        localStorage.clear();
        history.push('/');
        history.go(0);
      } else {
        setCredentialsValidated('error');
      }
    });
  };

  const handleDeleteAccountConfirmedClicked = () => {
    handleDeleteAccountClickedApi();
    console.log(email);
    console.log(password);
  };

  const handleDeleteButtonClicked = () => {
    console.log('deleteButtonClicked');
    setShowButtons(false);
  };

  if (!props.openDeleteAccountModal) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="overlay-styles" />
        <div
          className="confirmation-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <h1>Are you sure you want to delete your account?</h1>
          <h3>
            Deleting your account is permanent and will remove all content
            including uploaded and purchased photos, collections and comments.
          </h3>

          {showButtons ? (
            <React.Fragment>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDeleteButtonClicked}
              >
                Yes, delete
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  props.setOpenDeleteAccountModal(false);
                }}
              >
                No, don't delete
              </Button>
            </React.Fragment>
          ) : null}

          {!showButtons ? (
            <React.Fragment>
              <form className={classes.root} noValidate autoComplete="off">
                <div className="cart-details-grid"></div>
                <h2>Email</h2>
                <div>
                  <TextField
                    required
                    // error={errorValue}
                    // helperText={errorText}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      //   handleTitleInput(e.target.value);
                    }}
                    id="outlined-required"
                    label="Required"
                    defaultValue={props.oldTitle}
                    variant="outlined"
                  />
                </div>

                <h2>Password</h2>
                <div onClick={(e) => e.stopPropagation()}>
                  <TextField
                    required
                    // error={errorValue}
                    // helperText={errorText}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      //   handleTitleInput(e.target.value);
                    }}
                    id="outlined-required"
                    label="Required"
                    defaultValue={props.oldTitle}
                    variant="outlined"
                    type="password"
                  />
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={handleDeleteAccountConfirmedClicked}
                  >
                    CONFIRM
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => {
                      props.setOpenDeleteAccountModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>

                {credentialsValidated === 'error' ? (
                  <h2 style={{ color: 'red' }}>Incorrect Email or Password</h2>
                ) : null}
              </form>
            </React.Fragment>
          ) : null}
        </div>
      </React.Fragment>,
      document.getElementById('toolbarPortal')
    );
  }
}
