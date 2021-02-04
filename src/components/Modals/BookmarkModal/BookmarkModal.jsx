import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import './BookmarkModal.css';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import axios from 'axios';

import CollectionFolder from './collectionFolder/CollectionFolder';
import BookmarkConfirmationModal from './BookmarkConfirmationModal/BookmarkConfirmationModal';

export default function BookmarkModal(props) {
  const [
    bookmarkConfirmationModalOpen,
    setBookmarkConfirmationModalOpen,
  ] = useState(false);
  const [modalCollectionName, setModalCollectionName] = useState(null);
  const [enteredCollection, setEnteredCollection] = useState('');

  const [usersCollections, setUsersCollections] = useState([]);

  const [showCreateCollectionButton, setShowCreateCollectionButton] = useState(
    true
  );
  const [privateCollection, setPrivateCollection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasCollections, setHasCollections] = useState(false);

  useEffect(() => {
    const getUsersCollections = () => {
      const userID = localStorage.getItem('userID');
      axios({
        method: 'GET',
        url: 'http://localhost:5000/get_users_collection',
        params: {
          user_id: userID,
          batch_size: 20,
        },
      }).then((response) => {
        if (response.data.result !== false) {
          setUsersCollections(response.data.result);
          setHasCollections(true);
        }
        setLoading(false);
      });
    };
    getUsersCollections();
  }, []);

  const addPhotoToCollections = (col_id) => {
    axios({
      method: 'POST',
      url: 'http://localhost:5000/add_photo_to_collection',
      params: {
        collection_id: col_id,
        image_id: props.photoId,
      },
    }).then((response) => {
      console.log(response.data.result);
      if (response.data.result) {
        const collection = usersCollections.filter(
          (collection) => collection.collection_id === col_id
        );

        setModalCollectionName(collection.collection_name);
        setBookmarkConfirmationModalOpen(true);
      }
    });
  };

  const handleEnteredCollection = (e) => {
    e.preventDefault();
    const createCollections = () => {
      axios({
        method: 'POST',
        url: 'http://localhost:5000/create_collection',
        params: {
          collection_name: enteredCollection,
          private: privateCollection,
        },
      }).then((response) => {
        if (response.data.result) {
          addPhotoToCollections(response.data.result);
        }
      });
    };
    createCollections();
  };

  if (!props.openModal) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="overlayStyles" />
        <div
          className="bookmarkModal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h2>Add to Collection</h2>

          {showCreateCollectionButton ? (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setShowCreateCollectionButton(false);
              }}
            >
              Create a new collection
            </Button>
          ) : null}

          {showCreateCollectionButton ? (
            <div className="collection-folders">
              {loading && 'Loading...'}
              {!hasCollections && 'You have not created any collections yet'}
              {usersCollections.map((collection) => {
                return (
                  <CollectionFolder
                    key={collection.collection_id}
                    collectionInfo={collection}
                    photoId={props.photoId}
                    addPhotoToCollections={addPhotoToCollections}
                  />
                );
              })}
            </div>
          ) : null}

          {!showCreateCollectionButton ? (
            <div className="enteredCollection">
              <form onSubmit={handleEnteredCollection}>
                <div>
                  <input
                    type="reply"
                    onChange={(e) => setEnteredCollection(e.target.value)}
                  />
                </div>
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={privateCollection}
                        onChange={() => {
                          if (privateCollection === true) {
                            setPrivateCollection(0);
                          } else {
                            setPrivateCollection(1);
                          }
                        }}
                        name="privateCheckbox"
                        color="primary"
                      />
                    }
                    label="Private"
                  />
                </div>
                <Button variant="contained" color="primary" type="submit">
                  Create collection
                </Button>
              </form>

              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setShowCreateCollectionButton(true);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : null}
        </div>

        <div
          onClick={() => {
            setBookmarkConfirmationModalOpen(false);
          }}
        >
          {bookmarkConfirmationModalOpen ? (
            <BookmarkConfirmationModal
              openModal={true}
              photoID={props.photoId}
              modalCollectionName={modalCollectionName}
            />
          ) : null}
        </div>
      </React.Fragment>,
      document.getElementById('confirmationPortal')
    );
  }
}
