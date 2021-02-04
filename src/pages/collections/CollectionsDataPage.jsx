import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './CollectionDataPage.css';
import LockIcon from '@material-ui/icons/Lock';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '../../components/toolbar/toolbar';
import CollectionFeed from '../../components/collections/collection/collectionDataPage/CollectionFeed';

export default function CollectionDataPage(props) {
  const [username, setUsername] = useState(props.location.state.creator_id);
  const [collectionImages, setCollectionImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [privateCollection, setPrivateCollection] = useState(
    props.location.state.private
  );

  const history = useHistory();

  useEffect(() => {
    axios({
      url: 'https://photo-pro.herokuapp.com//get_user_username',
      params: { user_id: props.location.state.creator_id },
    }).then((response) => {
      if (response.data.result) {
        setUsername(response.data.result);
      }
    });
    // eslint-disable-next-line
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  // the below line is to get rid of warning messages in useEffect
  const {
    location: {
      state: { collection_id: collectionID },
    },
  } = props;

  console.log(props.location.state);

  useEffect(() => {
    console.log('getting collections data');
    const getCollectionsById = () => {
      axios({
        method: 'GET',
        url: 'https://photo-pro.herokuapp.com//get_collection_data',
        params: {
          collection_id: collectionID,
        },
      }).then((response) => {
        console.log(response);
        if (response.data.result) {
          setCollectionImages(response.data.result);
        }
        setLoading(false);
      });
    };
    getCollectionsById();
  }, [privateCollection, collectionID]);

  const deleteCollection = () => {
    axios({
      method: 'POST',
      url: 'https://photo-pro.herokuapp.com//delete_collection',
      params: {
        collection_id: props.location.state.collection_id,
      },
    }).then((response) => {
      console.log(response);
      if (response.data.result) {
        history.goBack();
      }
    });
  };

  const updateCollectionsPrivate = (privValue) => {
    axios({
      method: 'POST',
      url: 'https://photo-pro.herokuapp.com//update_collections_private',
      params: {
        collection_id: props.location.state.collection_id,
        private: privValue,
      },
    }).then((response) => {
      console.log(response);
      if (privValue === 0) {
        setPrivateCollection('false');
      } else {
        setPrivateCollection('true');
      }
    });
  };

  const handleEditCollectionClose = () => {
    setAnchorEl(null);
  };

  const handleChangePrivateClicked = () => {
    if (privateCollection === 'true') {
      updateCollectionsPrivate(0);
    } else {
      updateCollectionsPrivate(1);
    }
  };

  const handleEditCollectionClicked = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // console.log(collectionImages[0].img);

  return (
    <React.Fragment>
      <Toolbar />
      <div className="collectionDataWrapper">
        <div className="circle-wrapper">
          <div className="circleBase">
            <div className="collection-info">
              {privateCollection === 'true' ? <LockIcon /> : null}
              <h1>{props.location.state.collection_name}</h1>
              <p>by @{username}</p>
              <p>Total photos: {collectionImages.length}</p>

              {props.location.state.isMyCollection === 'true' ? (
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  variant="outlined"
                  color="primary"
                  onClick={handleEditCollectionClicked}
                >
                  Edit collection
                </Button>
              ) : null}
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleEditCollectionClose}
              >
                {privateCollection === 'true' ? (
                  <MenuItem onClick={handleChangePrivateClicked}>
                    Make Public
                  </MenuItem>
                ) : (
                  <MenuItem onClick={handleChangePrivateClicked}>
                    Make Private
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    deleteCollection();
                  }}
                >
                  Delete collection
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>

        <CollectionFeed
          retrievedImgs={collectionImages}
          isMyCollection={props.location.state.isMyCollection}
          loading={loading}
        />
      </div>
      <h2 style={{ textAlign: 'center' }}>{loading && 'Loading...'}</h2>
    </React.Fragment>
  );
}
