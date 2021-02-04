import React, { useState, useEffect, useCallback, useRef } from 'react';
import './UserPhotos.css';
import axios from 'axios';
import ImageCard from '../feed/ImageCard/ImageCard';
import BookmarkModal from '../Modals/BookmarkModal/BookmarkModal';

const UserPhotos = (props) => {
  const [profileImgs, setProfileImgs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photoIdBookmarked, setPhotoIdBookmarked] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasPhotos, setHasPhotos] = useState(true);
  const { userID } = props;
  const displayMyProfile =
    localStorage.getItem('userID') === userID ? true : false;
  const userLoggedIn = localStorage.getItem('userLoggedIn');
  const [lastID, setLastID] = useState(null);
  const fetchIsCancelled = useRef(false);
  const cancelAxiosRequest = useRef();
  const observer = useRef();
  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLoading(true);
          console.log(`called with last_id of ${lastID}`);
          setTimeout(() => {
            fetchProfilePhotos(lastID);
          }, 1000);
        }
      });

      if (node) observer.current.observe(node);
    },
    // eslint-disable-next-line
    [loading, hasMore]
  );

  useEffect(() => {
    if (profileImgs.length === 0) {
      setHasPhotos(false);
    }
  }, [profileImgs]);

  useEffect(() => {
    window.scrollTo(0, 0);

    axios({
      url: 'https://photo-pro.herokuapp.com//get_user_username',
      params: { user_id: userID },
    }).then((response) => {
      // if (response.data.result) {
      //   setUsername(response.data.result);
      // }
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setTimeout(() => {
      // temp fix to api call the clashes with another and which both modify file = "image.jpg"
      fetchProfilePhotos();
    }, 700);

    return () => {
      if (cancelAxiosRequest.current != null) cancelAxiosRequest.current();

      fetchIsCancelled.current = true;
      setProfileImgs([]);
      setHasMore(true);
    };
    // eslint-disable-next-line
  }, [userID]);

  const fetchProfilePhotos = (last_id) => {
    setLoading(true);

    axios({
      method: 'GET',
      url: 'https://photo-pro.herokuapp.com//profile_photos',
      params: { user_id: userID, batch_size: 5, last_id: last_id },
      cancelToken: new axios.CancelToken(
        (c) => (cancelAxiosRequest.current = c)
      ),
    })
      .then((res) => {
        console.log(res);
        if (res.data.result !== false && !fetchIsCancelled.current) {
          setLastID(res.data.last_id);
          setHasMore(true);
          setLoading(false);
          setProfileImgs((prevImgs) => {
            return [...prevImgs, ...res.data.result];
          });
        } else if (!fetchIsCancelled.current) {
          setLoading(false);
          setHasMore(false);
        }
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          return;
        }
      });
  };

  return (
    <React.Fragment>
      {displayMyProfile ? (
        <h2 style={{ marginTop: '10%', marginLeft: '9%' }}>
          Uploaded Images: {profileImgs.length}
        </h2>
      ) : (
        <h2 style={{ marginTop: '10%', marginLeft: '9%' }}>
          Uploads: {profileImgs.length}
        </h2>
      )}

      <div className="image-grid">
        {profileImgs.map((image, index) => {
          if (image === null) {
            return null;
          }

          if (profileImgs.length === index + 1) {
            return (
              <React.Fragment key={index}>
                <ImageCard
                  key={image.id}
                  image={image}
                  setOpenBookmarkModal={setModalIsOpen}
                  setPhotoId={setPhotoIdBookmarked}
                  userLoggedIn={userLoggedIn}
                />
                <div
                  key={index}
                  ref={lastImageRef}
                  style={{
                    position: 'relative',
                    bottom: '200px',
                    // border: '3px solid red',
                    height: '0%',
                  }}
                ></div>
              </React.Fragment>
            );
          } else {
            return (
              <ImageCard
                key={image.id}
                image={image}
                setOpenBookmarkModal={setModalIsOpen}
                setPhotoId={setPhotoIdBookmarked}
                userLoggedIn={userLoggedIn}
              />
            );
          }
        })}
      </div>
      <h2 style={{ textAlign: 'center' }}>{loading && 'Loading...'}</h2>
      {hasPhotos ? (
        <h2 style={{ textAlign: 'center' }}>
          You haven't uploaded any photos!
        </h2>
      ) : (
        <React.Fragment>
          <h2 style={{ textAlign: 'center' }}>
            {!hasMore && 'No more images to display'}
          </h2>
        </React.Fragment>
      )}

      {modalIsOpen ? (
        <BookmarkModal
          openModal={modalIsOpen}
          setOpenModal={setModalIsOpen}
          photoId={photoIdBookmarked}
        ></BookmarkModal>
      ) : null}
    </React.Fragment>
  );
};

export default UserPhotos;
