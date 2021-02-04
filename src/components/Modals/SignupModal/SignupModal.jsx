import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import './SignupModal.css';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Email from './Textfields/Email';
import FirstName from './Textfields/FirstName';
import LastName from './Textfields/LastName';
import Password from './Textfields/Password';
import Username from './Textfields/Username';
import TextField from '@material-ui/core/TextField';

export default function RegistrationPage(props) {
  const [submitFormClicked, setSubmitFormClicked] = useState(false);

  const [firstNameValidated, setFirstNameValidated] = useState([false, '']);
  const [lastNameValidated, setLastNamedValidated] = useState([false, '']);
  const [emailValidated, setEmailValidated] = useState([false, '']);
  const [passwordValidated, setPasswordValidated] = useState([false, '']);
  const [usernameValidated, setUsernameValidated] = useState([false, '']);

  const [codeGenerated, setCodeGenerated] = useState(null);
  const [enteredCode, setEnteredCode] = useState(null);
  const [emailConfirmed, setEmailConfirmed] = useState(null);
  const [userRegistered, setUserRegistered] = useState(null);

  const [loading, setLoading] = useState(false);

  const [verifyLoading, setverifyLoading] = useState(false);

  useEffect(() => {
    const verifyUser = () => {
      setverifyLoading(true);
      axios({
        method: 'POST',
        url: 'http://localhost:5000/verify_email',
        params: {
          email: emailValidated[1],
        },
      }).then((response) => {
        console.log(response);
        if (response.data.result) {
          setCodeGenerated(response.data.result);
        } else {
          setCodeGenerated(false);
        }
        setverifyLoading(false);
      });
    };

    if (
      firstNameValidated[0] &&
      lastNameValidated[0] &&
      emailValidated[0] &&
      passwordValidated[0] &&
      usernameValidated[0]
    ) {
      verifyUser();
    }
  }, [
    firstNameValidated,
    lastNameValidated,
    emailValidated,
    passwordValidated,
    usernameValidated,
  ]);

  const registerUser = () => {
    setLoading(true);
    axios({
      method: 'POST',
      url: 'http://localhost:5000/create_user',
      params: {
        email: emailValidated[1],
        password: passwordValidated[1],
        first: firstNameValidated[1],
        last: lastNameValidated[1],
        username: usernameValidated[1],
      },
    }).then((response) => {
      console.log(response);
      if (response.data.result) {
        setUserRegistered(true);
      }
      setLoading(false);
    });
  };

  const handleCodeEntered = () => {
    if (codeGenerated === enteredCode) {
      setEmailConfirmed(true);
      registerUser();
    } else {
      setEmailConfirmed(false);
    }
  };

  if (!props.openSignupModal) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="overlayStyles" />
        <div
          className="signupModal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {codeGenerated === null ? (
            <React.Fragment>
              <h1>Join PhotoPro</h1>
              <FirstName
                submitFormClicked={submitFormClicked}
                setFirstNameValidated={setFirstNameValidated}
              />
              <LastName
                submitFormClicked={submitFormClicked}
                setLastNameValidated={setLastNamedValidated}
              />
              <Email
                submitFormClicked={submitFormClicked}
                setEmailValidated={setEmailValidated}
              />
              <Username
                submitFormClicked={submitFormClicked}
                setUsernameValidated={setUsernameValidated}
              />
              <Password
                submitFormClicked={submitFormClicked}
                setPasswordValidated={setPasswordValidated}
              />
              <h3 style={{ color: 'grey' }}>{verifyLoading && 'Loading...'}</h3>
              <div className="register-button">
                <Button
                  variant="outlined"
                  color="primary"
                  block
                  bsSize="large"
                  onClick={() => {
                    setSubmitFormClicked(!submitFormClicked);
                  }}
                >
                  Confirm Details
                </Button>
              </div>
            </React.Fragment>
          ) : null}

          {codeGenerated === false ? (
            <h2 style={{ color: 'red' }}>Invalid email provided</h2>
          ) : null}

          {codeGenerated !== null && userRegistered !== true ? (
            <React.Fragment>
              <div>
                <h1 style={{ color: 'grey' }}>Please verify your email </h1>
                <h2>Enter the code we've just sent to {emailValidated[1]}:</h2>
                <div style={{ marginBottom: '5%' }}>
                  <TextField
                    required
                    // error={errorValue}
                    // helperText={errorText}
                    onChange={(e) => {
                      setEnteredCode(e.target.value);
                    }}
                    label="Code"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
                <h3 style={{ color: 'grey' }}>{loading && 'Loading...'}</h3>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleCodeEntered}
                  >
                    Confirm Code
                  </Button>
                </div>
              </div>
            </React.Fragment>
          ) : null}

          {emailConfirmed === false ? (
            <h2>Incorrect code, try again.</h2>
          ) : null}

          {userRegistered === true ? (
            <React.Fragment>
              <h1 style={{ color: 'grey' }}>
                Your email is verified, welcome to PhotoPro!
              </h1>
              <h2> Sign in with your details.</h2>
            </React.Fragment>
          ) : null}
        </div>
      </React.Fragment>,
      document.getElementById('toolbarPortal')
    );
  }
}
