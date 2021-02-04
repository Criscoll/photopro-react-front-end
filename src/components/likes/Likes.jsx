import React, { useState, useEffect } from 'react';
import './Likes.css';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: '2rem',
    height: '2rem',
  },
  liked: {
    color: 'rgba(255, 255, 255, 1)',
    backgroundColor: 'rgba(213, 48, 48, 1)',
  },

  unliked: {},
});

function Likes(props) {
  const [num_likes, set_num_likes] = useState();
  const [postLiked, setPostLiked] = useState(false);
  const classes = useStyles();

  const { image_id: imageID } = props;
  let userID = localStorage.getItem('userID');

  useEffect(() => {
    axios({
      method: 'GET',
      url: 'https://photo-pro.herokuapp.com//get_num_likes_of_image',
      params: { image_id: imageID },
    }).then((response) => {
      if (response.data.result !== false) {
        set_num_likes(response.data.result);
      } else {
        set_num_likes(0);
      }
    });
  }, [imageID]);

  useEffect(() => {
    props.setNumLikes(num_likes);
    // eslint-disable-next-line
  }, [num_likes]);

  useEffect(() => {
    const checkIfLiked = () => {
      axios({
        url: 'https://photo-pro.herokuapp.com//check_if_user_liked_photo',
        params: { image_id: imageID },
      }).then((response) => {
        console.log(response);
        if (response.data.result) {
          setPostLiked(true);
        } else {
          setPostLiked(false);
        }
      });
    };
    checkIfLiked();
  }, [userID, imageID]);

  const handleLikeClicked = () => {
    if (userID != null) {
      if (!postLiked) {
        post_likes();
      } else {
        delete_likes();
      }
    }
  };

  const sendLikeNotification = () => {
    axios({
      url: 'https://photo-pro.herokuapp.com//send_notification',
      params: {
        uploader_id: props.uploader_id,
        notification: 'like',
        image_id: imageID,
      },
    }).then((response) => {
      console.log(response);
    });
  };

  const post_likes = () => {
    const updateLikeRecommendation = () => {
      axios({
        method: 'GET',
        url: 'https://photo-pro.herokuapp.com//update_likes_recommendation',
        params: { image_id: imageID },
      }).then((res) => {
        console.log(res);
      });
    };

    axios({
      method: 'GET',
      url: 'https://photo-pro.herokuapp.com//post_like_to_image',
      params: { image_id: imageID },
    }).then((response) => {
      console.log(response);
      if (response.data.result) {
        set_num_likes((prevState) => parseInt(prevState) + 1);
        setPostLiked(true);
        sendLikeNotification();
        updateLikeRecommendation();
      }
    });
  };

  const delete_likes = () => {
    axios({
      method: 'POST',
      url: 'https://photo-pro.herokuapp.com//delete_like_from_image',
      params: { image_id: imageID },
    }).then((response) => {
      if (response.data.result) {
        set_num_likes((prevState) => parseInt(prevState) - 1);
        setPostLiked(false);
      }
      return response.data.result;
    });
  };

  let buttonClass;
  if (postLiked) {
    buttonClass = classes.liked;
  } else {
    buttonClass = classes.unliked;
  }

  return (
    <React.Fragment>
      <div className="like">
        <div style={{ textAlign: 'center' }}>
          <IconButton
            classes={{ root: `${classes.root} ${buttonClass}` }}
            onClick={handleLikeClicked}
            disabled={
              localStorage.getItem('userLoggedIn') &&
              localStorage.getItem('userID') !== props.uploader_id
                ? false
                : true
            }
          >
            <FavoriteIcon />
          </IconButton>
        </div>

        <p>{num_likes}</p>
      </div>
    </React.Fragment>
  );
}

export default Likes;
