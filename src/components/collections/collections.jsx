import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './collections.css';
import { Redirect } from 'react-router-dom';
import Collection from './collection/Collection';
import Userbackground from '../../background/user-background/user-background.jpg';

export default function Collections(props) {
  const [username, setUsername] = useState([props.userID]);
  const [email, setEmail] = useState('');
  const [allCollections, setAllCollections] = useState([]);
  const [collectionClicked, setCollectionClicked] = useState(false);
  const [collectionIdClicked, setCollectionIdClicked] = useState(null);
  const [collectionNameClicked, setCollectionNameClicked] = useState(null);
  const [collectionPrivateClicked, setCollectionPrivateClicked] = useState(
    null
  );
  const [collectionNumPhotosClicked, setCollectionNumPhotosClicked] = useState(
    null
  );
  const [collectionCreatorClicked, setCollectionCreatorClicked] = useState(
    null
  );

  const [loading, setLoading] = useState(true);
  const [hasCollections, setHasCollections] = useState(true);

  const { userID, displayMyProfile } = props;

  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    axios({
      url: 'https://photo-pro.herokuapp.com//get_user_username',
      params: { user_id: userID },
    }).then((response) => {
      if (response.data.result) {
        setUsername(response.data.result);
      }
    });
    axios({
      url: 'https://photo-pro.herokuapp.com//get_user_email',
      params: { user_id: userID },
    }).then((response) => {
      if (response.data.result) {
        setEmail(response.data.result);
      }
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const getUsersCollections = () => {
      axios({
        method: 'GET',
        url: 'https://photo-pro.herokuapp.com//get_users_collection',
        params: {
          user_id: userID,
          batch_size: 20,
        },
      }).then((response) => {
        console.log(response);
        if (response.data.result !== false) {
          setAllCollections(response.data.result);
          if (
            response.data.result.find(
              (collection) => collection.private === false
            ) ||
            displayMyProfile === true
          ) {
            setHasCollections(true);
          } else {
            setHasCollections(false);
          }
        } else {
          setHasCollections(false);
        }

        setLoading(false);
      });
    };
    getUsersCollections();
    // eslint-disable-next-line
  }, [userID]);

  const getProfilePhoto = () => {
    axios({
      method: 'GET',
      url: 'https://photo-pro.herokuapp.com//get_profile_photo',
      params: {
        user_id: userID,
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
    getProfilePhoto();
    // eslint-disable-next-line
  }, []);

  console.log(profileImg);

  const collectionsComponents = allCollections.map((collection) => {
    if (displayMyProfile === true || collection.private === false) {
      return (
        <Collection
          key={collection.collection_id}
          collection={collection}
          setCollectionClicked={setCollectionClicked}
          setCollectionIdClicked={setCollectionIdClicked}
          setCollectionNameClicked={setCollectionNameClicked}
          setCollectionPrivateClicked={setCollectionPrivateClicked}
          setCollectionNumPhotosClicked={setCollectionNumPhotosClicked}
          setCollectionCreatorClicked={setCollectionCreatorClicked}
        />
      );
    }
    return null;
  });

  const collectionData = (
    <Redirect
      push
      to={{
        pathname: `/collection-${collectionIdClicked}`,
        state: {
          collection_id: `${collectionIdClicked}`,
          collection_name: `${collectionNameClicked}`,
          private: `${collectionPrivateClicked}`,
          num_photos: `${collectionNumPhotosClicked}`,
          creator_id: `${collectionCreatorClicked}`,
          isMyCollection: `${displayMyProfile}`,
        },
      }}
    />
  );

  let componentsRender;
  if (collectionClicked) {
    componentsRender = collectionData;
  } else {
    componentsRender = (
      <div className="collectionsPageWrapper">
        {!props.displayMyProfile ? (
          <React.Fragment>
            <div
              className="userpage-username"
              style={{
                backgroundImage: `url(${Userbackground})`,
              }}
            >
              {profileImg !== null ? (
                <div className="users-profile-pic">
                  <div className="dp-photo-wrapper">
                    <div className="dp-photo">
                      <img
                        src={`data:image/jpg;base64,${profileImg}`}
                        alt="collection"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {!props.displayMyProfile ? (
                <h1 style={{ textAlign: 'center', margin: '0' }}>{username}</h1>
              ) : null}

              {!props.displayMyProfile ? (
                <h3 style={{ textAlign: 'center' }}>Email: {email}</h3>
              ) : null}
            </div>
          </React.Fragment>
        ) : null}

        <div className="title">
          {props.displayMyProfile ? (
            <h2
              className="quicksand"
              style={{ marginTop: '10%', textAlign: 'center' }}
            >
              My collections
            </h2>
          ) : (
            <h2
              className="quicksand"
              style={{
                marginTop: '10%',
                marginBottom: '8%',
                textAlign: 'center',
              }}
            >
              Public Collections
            </h2>
          )}
        </div>
        <div className="collectionsWrapper">{collectionsComponents}</div>
      </div>
    );
  }

  return (
    <React.Fragment>
      {componentsRender}
      <h1 style={{ textAlign: 'center' }}>{loading && 'Loading...'} </h1>
      <h2 style={{ textAlign: 'center' }}>
        {!hasCollections && 'This user does not have any public collections'}
      </h2>
    </React.Fragment>
  );
}
