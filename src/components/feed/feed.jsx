import React, { useState, useEffect, useRef, useCallback } from 'react';
import './feed.css';
import axios from 'axios';
import ImageCard from './ImageCard/ImageCard';
import BookmarkModal from '../Modals/BookmarkModal/BookmarkModal';

const Feed = (props) => {
  const [imgs, setImgs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photoIdBookmarked, setPhotoIdBookmarked] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const userLoggedIn = localStorage.getItem('userLoggedIn');
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
          fetchImages(props.query, score);
        }
      });

      if (node) observer.current.observe(node);
    },
    // eslint-disable-next-line
    [loading, hasMore, props.query]
  );

  useEffect(() => {
    fetchIsCancelled.current = false;
    setLoading(true);

    setTimeout(() => {
      fetchImages(props.query, score);
    }, 150);

    return () => {
      if (cancelAxiosRequest.current != null) cancelAxiosRequest.current();

      fetchIsCancelled.current = true;
      setImgs([]);
      setHasMore(true);
    };
    // eslint-disable-next-line
  }, [props.query]);

  const fetchImages = (term, paramScore) => {
    if (term === null) {
      console.log(`called get_global_recommendations with score ${paramScore}`);
      axios({
        method: 'GET',
        url: 'http://localhost:5000/get_global_recommendations',
        params: { score: paramScore, batch_size: 10 }, //user_id: 1
        cancelToken: new axios.CancelToken(
          (c) => (cancelAxiosRequest.current = c)
        ),
      })
        .then((res) => {
          if (res.data.result !== false && !fetchIsCancelled.current) {
            setScore(res.data.score);
            setHasMore(true);
            setLoading(false);
            setImgs((prevImgs) => {
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
    } else {
      axios({
        method: 'GET',
        url: 'http://localhost:5000/discovery',
        params: { query: term, batch_size: 10 }, //user_id: 1
        cancelToken: new axios.CancelToken(
          (c) => (cancelAxiosRequest.current = c)
        ),
      })
        .then((res) => {
          if (res.data.result !== false && !fetchIsCancelled.current) {
            setHasMore(true);
            setLoading(false);
            setImgs((prevImgs) => {
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
    }
  };

  return (
    <React.Fragment>
      {/* <h2>Found Images: {imgs.length}</h2> */}

      <div className="image-grid">
        {imgs.map((image, index) => {
          if (image === null) {
            return null;
          }

          if (imgs.length === index + 1) {
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
      <h2 style={{ textAlign: 'center' }}>
        {!hasMore && 'No more images to display'}
      </h2>

      <div
        onClick={() => {
          setModalIsOpen(false);
        }}
      >
        {modalIsOpen ? (
          <BookmarkModal
            openModal={true}
            photoId={photoIdBookmarked}
          ></BookmarkModal>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default Feed;
