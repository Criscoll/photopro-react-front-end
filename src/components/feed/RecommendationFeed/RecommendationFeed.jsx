import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../feed.css';
import axios from 'axios';
import ImageCard from '../ImageCard/ImageCard';
import BookmarkModal from '../../Modals/BookmarkModal/BookmarkModal';

const RecommendationFeed = () => {
  const [imgs, setImgs] = useState([]);
  const [score, setScore] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photoIdBookmarked, setPhotoIdBookmarked] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

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

          setTimeout(() => {
            fetchRecommendations();
          }, 1500);
        }
      });

      if (node) observer.current.observe(node);
    },
    // eslint-disable-next-line
    [loading, hasMore]
  );

  useEffect(() => {
    fetchIsCancelled.current = false;
    setLoading(true);

    setTimeout(() => {
      fetchRecommendations();
    }, 150);

    return () => {
      if (cancelAxiosRequest.current != null) cancelAxiosRequest.current();

      fetchIsCancelled.current = true;
      setImgs([]);
      setHasMore(true);
    };
    // eslint-disable-next-line
  }, []);

  const fetchRecommendations = () => {
    console.log(`fetching recommendation with a score of ${score}`);
    axios({
      method: 'GET',
      url: 'http://localhost:5000/get_recommended_images',
      params: { score: score, batch_size: 10 },
      cancelToken: new axios.CancelToken(
        (c) => (cancelAxiosRequest.current = c)
      ),
    })
      .then((res) => {
        console.log(res);
        if (res.data.result !== false && !fetchIsCancelled.current) {
          console.log(`setting score to ${res.data.score}`);
          setScore(res.data.score);
          setHasMore(true);
          setLoading(false);
          setImgs((prevImgs) => {
            return [...prevImgs, ...res.data.result];
          });
        } else if (!fetchIsCancelled.current) {
          console.log('no more images to return');
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

      {modalIsOpen ? (
        <BookmarkModal
          openModal={true}
          setOpenModal={setModalIsOpen}
          photoId={photoIdBookmarked}
        ></BookmarkModal>
      ) : null}
    </React.Fragment>
  );
};

export default RecommendationFeed;
