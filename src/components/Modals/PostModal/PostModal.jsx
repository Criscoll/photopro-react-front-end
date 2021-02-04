import ReactDom from 'react-dom';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import './PostModal.css';
import '../../../pages/PostInfo/PostInfo.css';
import FollowButton from '../../follow/followButton';
import Likes from '../../likes/Likes';
import Comments from '../../comments/Comments';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkModal from '../BookmarkModal/BookmarkModal';

export default function PostModal(props) {
  const [username, setUsername] = useState(props.uploader);
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [tags, setTags] = useState([]);
  const [commentUpdated, updateComments] = useState('');
  const [bookmarkModalIsOpen, setBookmarkModalIsOpen] = useState(false);
  const [relatedImages, setRelatedImages] = useState([]);
  const [relatedImagesLoading, setRelatedImagesLoading] = useState(true);
  const [hasRelatedImages, setHasRelatedImages] = useState(true);
  const cancelAxiosRequest = useRef();
  const { imageID } = props;
  const history = useHistory();

  useEffect(() => {
    axios({
      url: 'https://photo-pro.herokuapp.com//get_user_username',
      params: { user_id: props.uploader },
    }).then((response) => {
      if (response.data.result) {
        setUsername(response.data.result);
      }
    });

    axios({
      url: 'https://photo-pro.herokuapp.com//item_is_in_cart',
      params: { image_id: imageID },
    }).then((response) => {
      if (response.data.result) {
        setAddedToCart(true);
      }
    });

    axios({
      url: 'https://photo-pro.herokuapp.com//get_user_email',
      params: { user_id: props.uploader },
    }).then((response) => {
      if (response.data.result) {
        setEmail(response.data.result);
      }
    });

    axios({
      url: 'https://photo-pro.herokuapp.com//get_related_images',
      params: { image_id: imageID },
    }).then((response) => {
      console.log('~~~~~~~~~~~~Get Related Images~~~~~~~~~~~');
      console.log(response);
      if (response.data.result) {
        setRelatedImages(response.data.result);
        setHasRelatedImages(true);
      } else {
        setHasRelatedImages(false);
      }
      setRelatedImagesLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchTags = (id) => {
      axios({
        method: 'GET',
        url: 'https://photo-pro.herokuapp.com//get_tags',
        params: { image_id: id },
        cancelToken: new axios.CancelToken(
          (c) => (cancelAxiosRequest.current = c)
        ),
      }).then((res) => {
        if (res.data.result !== false && mounted) {
          setTags(res.data.result);
        } else if (mounted) {
          setTags([]);
        }
      });
    };

    const fetchComments = (id) => {
      axios({
        method: 'GET',
        url: 'https://photo-pro.herokuapp.com//get_comments_to_image',
        params: { image_id: id, batch_size: 20 },
        cancelToken: new axios.CancelToken(
          (c) => (cancelAxiosRequest.current = c)
        ),
      }).then((res) => {
        if (res.data.result !== false && mounted) {
          setComments(res.data.result);
        } else if (mounted) {
          setComments([]);
        }
        fetchTags(id);
      });
    };
    fetchComments(imageID);

    return () => {
      cancelAxiosRequest.current();
      mounted = false;
    };
  }, [commentUpdated, imageID]);

  const apiAddPurchase = (imageID) => {
    axios({
      method: 'POST',
      url: 'https://photo-pro.herokuapp.com//add_purchase',
      params: {
        save_for_later: 0,
        purchased: 0,
        image_id: String(imageID),
      },
    }).then((response) => {
      if (response.data.result !== false) {
        setAddedToCart(true);
      } else {
        setAddedToCart(false);
      }
    });
  };

  const apiRemovePurchase = (imageID) => {
    axios({
      method: 'POST',
      url: 'https://photo-pro.herokuapp.com//delete_item_from_cart',
      params: {
        image_id: String(imageID),
      },
    }).then((response) => {
      if (response.data.result !== false) {
        setAddedToCart(false);
      } else {
        setAddedToCart(true);
      }
    });
  };

  const handleBuyButton = () => {
    if (addedToCart) {
      apiRemovePurchase(props.imageID);
    } else {
      apiAddPurchase(props.imageID);
    }
  };

  const handleBookmarkClicked = () => {
    setBookmarkModalIsOpen(true);
  };

  if (!props.openModal) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="post-modal-overlay" />
        <div
          className="post-modal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="postWrapper">
            <div className="postInfo">
              <div className="username">
                {localStorage.getItem('userLoggedIn') ? (
                  <React.Fragment>
                    {parseInt(localStorage.getItem('userID')) !==
                    props.uploader ? (
                      <FollowButton uploader={props.uploader} />
                    ) : null}
                    <div className="bookmark-wrapper">
                      <IconButton
                        variant="contained"
                        onClick={handleBookmarkClicked}
                      >
                        <BookmarkIcon />
                      </IconButton>
                    </div>
                  </React.Fragment>
                ) : null}
                <Likes
                  setNumLikes={props.setNumLikes}
                  image_id={props.imageID}
                  uploader_id={props.uploader}
                />
              </div>
            </div>
            <div className="postImage">
              <div className="main-img">
                <img
                  src={`data:image/jpg;base64,${props.url}`}
                  alt={props.caption}
                />

                <div className="recImages-nested">
                  <h1 className="roboto"> Related Photos:</h1>

                  {relatedImages.length > 0 ? (
                    relatedImages.map((images, index) => {
                      return (
                        <div key={index} className="recImage">
                          <img
                            onClick={() => {
                              props.setRelatedImagesClicked(images);
                            }}
                            src={`data:image/jpg;base64,${images.img}`}
                            alt={images.caption}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <React.Fragment>
                      <h1>
                        {!hasRelatedImages &&
                          'No related images could be found'}
                      </h1>
                      <div
                        style={{
                          marginTop: '20vh',
                          marginRight: '20vh',
                          marginLeft: '20vh',
                        }}
                      ></div>
                    </React.Fragment>
                  )}
                </div>
              </div>

              <h2 style={{ textAlign: 'center' }}>
                {relatedImagesLoading && 'Loading...'}
              </h2>
            </div>
            <div className="postFeed-nested">
              <div className="title">
                <h1>{props.title}</h1>
                <div className="username-wrapper">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      history.push({
                        pathname: `/profile/${props.uploader}`,
                        state: { uploaderID: props.uploader },
                      });
                    }}
                  >
                    @{username}
                  </Button>
                </div>
                <p
                  className="roboto"
                  style={{ fontSize: '70%', textAlign: 'center' }}
                >
                  email: {email}
                </p>
              </div>

              <h2 className="roboto">{props.caption}</h2>
              <div className="postTags">
                <h3>
                  Tags:{' '}
                  {tags.length < 1 ? 'this post has no tags to display' : null}
                </h3>
                <div className="flexbox-tags">
                  {tags.length > 0
                    ? tags.map((tag, index) => {
                        return (
                          <Button key={index} variant="contained">
                            #{tag}
                          </Button>
                        );
                      })
                    : null}
                </div>
              </div>
              <div className="postPrice">
                <h2 className="roboto">Price: ${props.price}</h2>
                {localStorage.getItem('userLoggedIn') ? (
                  parseInt(localStorage.getItem('userID')) !==
                  props.uploader ? (
                    addedToCart ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBuyButton}
                      >
                        Added to Cart
                      </Button>
                    ) : (
                      <Button variant="contained" onClick={handleBuyButton}>
                        Add to Cart
                      </Button>
                    )
                  ) : null
                ) : null}
              </div>
              <div className="postComments">
                <h2 className="roboto">Comments:</h2>
                <Comments
                  image_id={props.imageID}
                  comments_list={comments}
                  updateComments={updateComments}
                  uploader_id={props.uploader}
                />
              </div>
            </div>
          </div>

          <div onClick={() => setBookmarkModalIsOpen(false)}>
            {bookmarkModalIsOpen ? (
              <BookmarkModal
                openModal={true}
                setOpenModal={setBookmarkModalIsOpen}
                photoId={props.imageID}
              ></BookmarkModal>
            ) : null}
          </div>
        </div>
      </React.Fragment>,

      document.getElementById('postPortal')
    );
  }
}
