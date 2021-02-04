import React, { useState } from 'react';
import ReactDom from 'react-dom';
import './LoginModal.css';
import { Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function LoginModal(props) {
  const [email, set_email] = useState('');
  const [password, set_password] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  let history = useHistory(); // router hook which provides access to dom history (allows for page transitions)

  function validate_email() {
    return email.length > 0 && email.length < 50;
  }

  function validate_password() {
    return password.length >= 8 && password.length < 16;
  }

  async function attempt_login(event) {
    event.preventDefault();

    const response = await axios.get('http://localhost:5000/login', {
      params: { email: email, password: password },
    });

    if (response.data.result) {
      localStorage.setItem('userLoggedIn', true);
      localStorage.setItem('userID', response.data.user_id);
      history.push('/');
      history.go(0);
    } else {
      setLoginFailed(true);
    }
  }

  function handleForgotPasswordClicked() {
    // history.push('/forgotpassword');
    props.setForgotPasswordModalIsOpen(true);
    props.setOpenLoginModal(false);
  }

  if (!props.openLoginModal) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="overlayStyles" />
        <div
          className="loginModal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="login-wrapper">
            <h1>Login</h1>
            <form onSubmit={attempt_login}>
              <FormGroup controlId="email" bsSize="large">
                <div>
                  <FormLabel>Email</FormLabel>
                </div>

                <FormControl
                  autoFocus
                  type="email"
                  value={email}
                  onChange={(e) => set_email(e.target.value)}
                />
              </FormGroup>

              <FormGroup controlId="password" bsSize="large">
                <div>
                  <FormLabel>Password</FormLabel>
                </div>

                <FormControl
                  value={password}
                  onChange={(e) => set_password(e.target.value)}
                  type="password"
                />
              </FormGroup>
              <div className="login-button">
                <Button
                  block
                  bsSize="large"
                  disabled={!validate_email() || !validate_password()}
                  type="submit"
                >
                  Login
                </Button>
              </div>
            </form>
            <Button block bsSize="large" onClick={handleForgotPasswordClicked}>
              Forgot Password
            </Button>
            <div>
              <Button
                block
                bsSize="large"
                type="submit"
                onClick={() => {
                  props.setOpenLoginModal(false);
                }}
              >
                Cancel
              </Button>
            </div>
            {loginFailed ? (
              <p style={{ color: 'red' }}>Incorrect email or password</p>
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </React.Fragment>,
      document.getElementById('toolbarPortal')
    );
  }
}
