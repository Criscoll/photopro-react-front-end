import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './toolbar.css';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Notifications from './notifications/notifications';
import logo from '../../logo/logo-new.png';
import ForgotPasswordModal from '../Modals/ForgotPasswordModal/ForgotPasswordModal';

import LoginModal from '../Modals/LoginModal/LoginModal';
import SignupModal from '../Modals/SignupModal/SignupModal';
import DeleteAccountModal from '../Modals/DeleteAccountModal/DeleteAccountModal';

const useStyles = makeStyles((theme) => ({
  root: {
    border: '3px solid red',
    margin: 'auto',
  },
  button: {
    color: 'rgb(83, 85, 89)',
  },
}));

function Toolbar() {
  const history = useHistory();
  const classes = useStyles();
  const loggedIn = localStorage.getItem('userLoggedIn');
  const [username, setUsername] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);

  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [forgotPasswordModalIsOpen, setForgotPasswordModalIsOpen] = useState(
    false
  );

  const [signupModalIsOpen, setSignupModalIsOpen] = useState(false);
  const [deleteAcountModalIsOpen, setDeleteAccountModalIsOpen] = useState(
    false
  );

  useEffect(() => {
    axios({
      url: 'https://photo-pro.herokuapp.com//get_user_username',
      params: { user_id: localStorage.getItem('userID') },
    }).then((response) => {
      if (response.data.result) {
        console.log(response);
        setUsername(response.data.result);
      }
    });
  }, []);

  const handleAccountClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAnchorEl(null);
  };

  const handleSignInClicked = () => {
    setLoginModalIsOpen(true);
  };

  const handleSignUpClicked = () => {
    setSignupModalIsOpen(true);
  };

  const handleProfileClicked = function () {
    const userID = localStorage.getItem('userID');
    console.log(`In toolbar the userID = ${userID}`);
    history.push({
      pathname: `/profile/${userID}`,
      state: { uploaderID: userID },
    });
  };

  const handleLogoutClicked = () => {
    localStorage.clear();
    history.push('/');
    history.go(0); // forces the page to re-render if you are already on it which causes it to display the right information
  };

  const handleDiscoveryClicked = () => {
    history.push('/recommendations');
  };

  const handleUploadClicked = () => {
    history.push('/uploadphoto');
  };

  const handleChangePassClicked = () => {
    history.push('/changepassword');
  };

  const handleCollectionsClicked = () => {
    const userID = localStorage.getItem('userID');
    console.log(`In toolbar the userID = ${userID}`);
    history.push({
      pathname: `/collections/${userID}`,
      state: { uploaderID: userID },
    });
  };

  const handleCartClicked = () => {
    history.push('/shopping-cart');
  };

  const handleMyPurchasesClicked = () => {
    history.push('/my-purchases');
  };

  const handleLogoClicked = () => {
    history.push('/');
    history.go(0);
  };

  const handleDeleteAccountClicked = () => {
    setDeleteAccountModalIsOpen(true);
    handleAccountClose();
  };

  console.log();

  let buttons;
  if (loggedIn === 'true') {
    buttons = (
      <React.Fragment>
        <div className={'flex-container-buttons-2'}>
          <Button
            variant="outlined"
            className={classes.button}
            size="small"
            onClick={handleDiscoveryClicked}
          >
            Discovery
          </Button>
          <Button
            variant="outlined"
            className={classes.button}
            size="small"
            onClick={handleCollectionsClicked}
          >
            Collections
          </Button>

          <Button
            variant="outlined"
            className={classes.button}
            size="small"
            onClick={handleCartClicked}
          >
            My Cart
          </Button>

          <Button
            variant="outlined"
            size="large"
            className={classes.button}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleAccountClick}
          >
            @{username}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleAccountClose}
          >
            <MenuItem onClick={handleProfileClicked}>Profile</MenuItem>
            <MenuItem onClick={handleMyPurchasesClicked}>My Purchases</MenuItem>
            <MenuItem onClick={handleChangePassClicked}>
              Change Password
            </MenuItem>
            <MenuItem onClick={handleDeleteAccountClicked}>
              Delete My Account
            </MenuItem>
            <MenuItem onClick={handleLogoutClicked}>Logout</MenuItem>
          </Menu>
          <Notifications />
        </div>
        <div className="toolbar-left">
          <Button
            variant="outlined"
            size="large"
            onClick={handleUploadClicked}
            // variant="outlined"
            color="primary"
            className={classes.button}
            startIcon={<CloudUploadIcon />}
          >
            Upload Photo
          </Button>
        </div>
      </React.Fragment>
    );
  } else {
    buttons = (
      <React.Fragment>
        <div className="toolbar-left-placeholder"></div>
        <div className="flex-container-buttons-1">
          <Button
            variant="outlined"
            size="large"
            className={classes.button}
            onClick={handleSignInClicked}
          >
            Sign in
          </Button>
          <Button
            variant="outlined"
            size="large"
            className={classes.button}
            onClick={handleSignUpClicked}
          >
            Getting Started
          </Button>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="flex-container-toolbar">
        <div className="logo">
          <img
            className="logo"
            src={logo}
            alt="Logo"
            onClick={handleLogoClicked}
          />
        </div>
        {buttons}

        {loginModalIsOpen ? (
          <div
            className="toolbar-modal-wrapper"
            onClick={() => {
              setLoginModalIsOpen(false);
            }}
          >
            <LoginModal
              openLoginModal={true}
              setOpenLoginModal={setLoginModalIsOpen}
              setForgotPasswordModalIsOpen={setForgotPasswordModalIsOpen}
            ></LoginModal>
          </div>
        ) : null}

        {forgotPasswordModalIsOpen ? (
          <div
            className="toolbar-modal-wrapper"
            onClick={() => {
              setForgotPasswordModalIsOpen(false);
            }}
          >
            <ForgotPasswordModal
              openForgotPasswordModal={true}
              setOpenForgotPasswordModal={setForgotPasswordModalIsOpen}
            ></ForgotPasswordModal>
          </div>
        ) : null}

        {signupModalIsOpen ? (
          <div
            className="toolbar-modal-wrapper"
            onClick={() => {
              setSignupModalIsOpen(false);
            }}
          >
            <SignupModal
              openSignupModal={true}
              setOpenSignupModal={setSignupModalIsOpen}
            ></SignupModal>
          </div>
        ) : null}

        {deleteAcountModalIsOpen ? (
          <div
            className="toolbar-modal-wrapper"
            onClick={() => {
              setDeleteAccountModalIsOpen(false);
            }}
          >
            <DeleteAccountModal
              openDeleteAccountModal={true}
              setOpenDeleteAccountModal={setDeleteAccountModalIsOpen}
            ></DeleteAccountModal>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
}

export default Toolbar;
