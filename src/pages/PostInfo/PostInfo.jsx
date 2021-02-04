import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import './PostInfo.css';
import Toolbar from '../../components/toolbar/toolbar';
import FollowButton from '../../components/follow/followButton';
import Likes from '../../components/likes/Likes';
import Comments from '../../components/comments/Comments';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkModal from '../../components/Modals/BookmarkModal/BookmarkModal';

const PostInfo = (props) => {
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);
  const [commentUpdated, updateComments] = useState('');
  const [bookmarkModalIsOpen, setBookmarkModalIsOpen] = useState(false);
  const cancelAxiosRequest = useRef();
  const {
    location: {
      state: { id: imageID },
    },
  } = props;
  const history = useHistory();

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
        console.log(res);
        if (res.data.result !== false && mounted) {
          console.log(res.data.result);
          setTags(res.data.result);
        } else if (mounted) {
          setTags([]);
        }
      });
    };
    const fetchRelatedImgs = (id) => {
      axios({
          method: 'GET',
          url: 'https://photo-pro.herokuapp.com//get_related_images',
          params: { image_id: id}, //user_id: 1

        }).then((res) => {
          console.log(res);
        });
    }

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
    fetchRelatedImgs(imageID);

    return () => {
      console.log('CLEAN UP - PostInfo');
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
        console.log(response);
      }
    });
  };

  const handleBuyButton = () => {
    apiAddPurchase(props.location.state.id);
  };

  const handleBookmarkClicked = () => {
    setBookmarkModalIsOpen(true);
  };

  return (
    <React.Fragment>
      <Toolbar />
      <div className="postWrapper">
        <div className="postInfo">
          <div className="username">
            <div className="username-wrapper">
              <Button
                varient="outlined"
                onClick={() => {
                  history.push({
                    pathname: `/profile/${props.location.state.uploader}`,
                    state: { uploaderID: props.location.state.uploader },
                  });
                }}
              >
                @{props.location.state.uploader}
              </Button>
            </div>
            {localStorage.getItem('userLoggedIn') ? (
              <React.Fragment>
                {localStorage.getItem('userID') !==
                props.location.state.uploader ? (
                  <FollowButton uploader={props.location.state.uploader} />
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
              num_likes={props.location.state.num_likes}
              image_id={props.location.state.id}
              uploader_id={props.location.state.uploader}
            />
          </div>
        </div>
        <div className="postImage">
          <img
            src={`data:image/jpg;base64,${props.location.state.url}`}
            alt={props.location.state.caption}
          />

          <div className="recImages-nested">
            <h1 className="roboto"> Related Photos:</h1>
            <div className="recImage"></div>
            <div className="recImage"></div>
            <div className="recImage"></div>
          </div>
        </div>
        <div className="postFeed-nested">
          <h1>{props.location.state.title}</h1>
          <h2 className="roboto">{props.location.state.caption}</h2>
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
            <h2 className="roboto">Price: ${props.location.state.price}</h2>
            <Button variant="contained" onClick={handleBuyButton}>
              Add to Cart
            </Button>
          </div>
          <div className="postComments">
            <h2 className="roboto">Comments:</h2>
            <Comments
              image_id={props.location.state.id}
              comments_list={comments}
              updateComments={updateComments}
              uploader_id={props.location.state.uploader}
            />
          </div>
        </div>
      </div>
      {bookmarkModalIsOpen ? (
        <BookmarkModal
          openModal={true}
          setOpenModal={setBookmarkModalIsOpen}
          photoId={props.location.state.id}
        ></BookmarkModal>
      ) : null}
    </React.Fragment>
  );
};

export default PostInfo;
