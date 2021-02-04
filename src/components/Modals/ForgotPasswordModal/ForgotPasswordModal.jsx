import React, { useState } from 'react';
import ReactDom from 'react-dom';
import './ForgotPasswordModal.css';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function ForgotPassword(props) {
  const [email, setEmail] = useState('');
  const [errorText, setErrorText] = useState('');
  const [hashValue, setHashValue] = useState('');
  const [errorValue, setErrorValue] = useState(false);
  const [enterEmailToVerifyOpen, setEnterEmailToVerifyOpen] = useState(true);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [newPasswordFormOpen, setNewPasswordFormOpen] = useState(false);

  const [successfulPasswordUpdate, setSuccessfulPasswordUpdate] = useState(
    false
  );

  const [codeVerified, setCodeVerified] = useState(null);

  const [enteredCode, setEnteredCode] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredNewPassword, setEnteredNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailInput = (text) => {
    if (
      text.length > 10 &&
      text.length < 50 &&
      text.includes('@') &&
      text.includes('.com')
    ) {
      setErrorValue(false);
      setErrorText('');
      return true;
    } else {
      setErrorText('Email must be entered and include an @ and .com');
      setErrorValue(true);
      return false;
    }
  };

  const forgotPasswordGetLink = () => {
    setLoading(true);
    axios({
      method: 'POST',
      url: 'https://photo-pro.herokuapp.com//forgot_password_get_change_password_link',
      params: {
        email: email,
      },
    }).then((response) => {
      if (response.data.result !== false) {
        console.log(response);
        setHashValue(response.data.result);
        setEnterEmailToVerifyOpen(false);
        setVerifyOpen(true);
      }
      setLoading(false);
    });
  };

  const handleSendEmailClicked = () => {
    forgotPasswordGetLink();
  };

  const forgotPasswordCodeSubmit = () => {
    axios({
      method: 'POST',
      url: 'https://photo-pro.herokuapp.com//reset_password',
      params: {
        email: enteredEmail,
        new_password: enteredNewPassword,
      },
    }).then((response) => {
      if (response.data.result !== false) {
        console.log(response);
        setNewPasswordFormOpen(false);
        setSuccessfulPasswordUpdate(true);
      }
    });
  };

  const handleCodeSubmitEntered = (e) => {
    e.stopPropagation();
    // compare the user's code with our code
    if (enteredCode === hashValue) {
      console.log('code is the same!');
      setCodeVerified(true);
      setVerifyOpen(false);
      setNewPasswordFormOpen(true);
    } else {
      console.log('code is the same!');
      setCodeVerified(false);
    }
  };

  const handNewPasswordSubmitted = () => {
    forgotPasswordCodeSubmit();
  };

  if (!props.openForgotPasswordModal) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="overlayStyles" />
        <div
          className="forgotPasswordModal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {enterEmailToVerifyOpen ? (
            <React.Fragment>
              <h1>Forgot Password</h1>
              <h3>If you forgot your password, you can reset it here.</h3>
              <h3>
                Please enter your email and you will receive an email with
                further instructions.
              </h3>

              <h2>Email</h2>
              <div>
                <TextField
                  required
                  error={errorValue}
                  helperText={errorText}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleEmailInput(e.target.value);
                  }}
                  id="outlined-required"
                  label="Required"
                  defaultValue={props.oldTitle}
                  variant="outlined"
                />
              </div>
              <h3>{loading && 'Loading...'}</h3>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSendEmailClicked}
                >
                  SEND EMAIL
                </Button>
              </div>
              <div>
                <Button
                  variant="contained"
                  color="default"
                  size="large"
                  onClick={() => {
                    props.setOpenForgotPasswordModal(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </React.Fragment>
          ) : null}

          {verifyOpen ? (
            <React.Fragment>
              <h1>Verify that it's you</h1>
              <h3>
                An email with a verification code was just sent to {email}
              </h3>
              <h2>Enter code</h2>
              <div>
                <TextField
                  required
                  // error={errorValue}
                  // helperText={errorText}
                  onChange={(e) => {
                    setEnteredCode(e.target.value);
                    // handleCodeInput(e.target.value);
                  }}
                  id="outlined-required"
                  label="Required"
                  defaultValue={props.oldTitle}
                  variant="outlined"
                />
              </div>

              <div>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleCodeSubmitEntered}
                >
                  Submit
                </Button>
              </div>
            </React.Fragment>
          ) : null}

          {newPasswordFormOpen ? (
            <React.Fragment>
              <h1>Code is verified!</h1>
              <h2>Now, enter your new password</h2>
              <h2>Email</h2>
              <div>
                <TextField
                  required
                  // error={errorValue}
                  // helperText={errorText}
                  onChange={(e) => {
                    setEnteredEmail(e.target.value);
                    handleEmailInput(e.target.value);
                  }}
                  id="outlined-required"
                  label="Required"
                  defaultValue={props.oldTitle}
                  variant="outlined"
                />
              </div>

              <h2>New Password</h2>
              <div>
                <TextField
                  required
                  type="password"
                  onChange={(e) => {
                    setEnteredNewPassword(e.target.value);
                    // handleCodeInput(e.target.value);
                  }}
                  id="outlined-required"
                  label="Required"
                  defaultValue={props.oldTitle}
                  variant="outlined"
                />
              </div>

              <div>
                <Button
                  variant="contained"
                  type="password"
                  color="primary"
                  size="large"
                  onClick={handNewPasswordSubmitted}
                >
                  Submit
                </Button>
              </div>
            </React.Fragment>
          ) : null}
          {successfulPasswordUpdate ? (
            <React.Fragment>
              <h1 style={{ color: 'grey' }}>
                Your password is successfully updated!
              </h1>
              <h2>You can now log in with your new password</h2>
            </React.Fragment>
          ) : null}

          {codeVerified === false ? (
            <h2 style={{ color: 'red' }}>Incorrect Code</h2>
          ) : null}
        </div>
      </React.Fragment>,
      document.getElementById('toolbarPortal')
    );
  }
}
