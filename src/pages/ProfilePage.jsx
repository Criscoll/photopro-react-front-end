import React, { useState, useEffect } from 'react';
import Toolbar from '../components/toolbar/toolbar';
import UserPhotos from '../components/userPhotos/UserPhotos';
import Collections from '../components/collections/collections';
import Button from '@material-ui/core/Button';
import './ProfilePage.css';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function ProfilePage(props) {
  const [profileImg, setProfileImg] = useState(null);

  const history = useHistory();
  const handleUploadPhotoClicked = () => {
    history.push('/upload-profile-photo');
  };

  const getProfilePhoto = (ID) => {
    axios({
      method: 'GET',
      url: 'https://photo-pro.herokuapp.com//get_profile_photo',
      params: {
        user_id: ID,
      },
    }).then((response) => {
      console.log(response);
      if (response.data.result) {
        setProfileImg(response.data.result);
      } else {
        setProfileImg(null);
      }
    });
  };

  useEffect(() => {
    if (localStorage.getItem('userID') === props.location.state.uploaderID) {
      getProfilePhoto(localStorage.getItem('userID'));
    } else {
      getProfilePhoto(props.location.state.uploaderID);
    }
    // eslint-disable-next-line
  }, []);

  if (props.location.state === undefined) {
    return (
      <React.Fragment>
        <Toolbar />
        <h1>Nothing found</h1>
      </React.Fragment>
    );
  } else {
    // This variable helps certain components decide what information they should display.
    const displayMyProfile =
      localStorage.getItem('userID') === props.location.state.uploaderID
        ? true
        : false;

    // Tries to move the page to the top when the profile page is rendered
    document.body.style.overflow = 'unset';
    return (
      <React.Fragment>
        <Toolbar />

        {displayMyProfile ? (
          <React.Fragment>
            <div className="users-profile-pic" style={{ marginTop: '20%' }}>
              <div className="dp-photo-wrapper">
                {profileImg !== null ? (
                  <React.Fragment>
                    <div className="dp-photo">
                      <img
                        src={`data:image/jpg;base64,${profileImg}`}
                        alt="profile"
                      />
                    </div>
                  </React.Fragment>
                ) : null}
              </div>

              <div className="upload-dp-button" style={{ textAlign: 'center' }}>
                <Button variant="outlined" onClick={handleUploadPhotoClicked}>
                  Update Profile Photo
                </Button>
              </div>
            </div>
          </React.Fragment>
        ) : null}

        <div className="profile-wrapper" style={{ marginTop: '20%' }}>
          {displayMyProfile ? null : (
            <Collections
              userID={props.location.state.uploaderID}
              displayMyProfile={displayMyProfile}
            />
          )}
          <UserPhotos
            userID={props.location.state.uploaderID}
            userLoggedIn={localStorage.getItem('userLoggedIn')}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default ProfilePage;
