import React from "react";
import "./ReplyComment.css";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import axios from "axios";

export default function ReplyComment(props) {
  let commenterID = String(props.replies_info.commenter);
  let userID = localStorage.getItem("userID");

  const handleDeleteClicked = () => {
    deleteComment(props.replies_info.comment_id);
    // props.updateReplies(props.replies_info.comment.concat("updated"));
  };

  let deleteButton =
    commenterID === userID ? (
      <IconButton onClick={handleDeleteClicked}>
        <DeleteOutlineIcon />
      </IconButton>
    ) : (
      <Button></Button>
    );

  const deleteComment = (commentID) => {
    axios({
      method: "POST",
      url: "http://localhost:5000/post_delete_comment",
      params: { comment_id: commentID },
    }).then((response) => {
      if (response.data.result) {
        console.log(
          `im here in replyComment deletecomment api call ${response}`
        );
        props.updateReplies(props.replies_info.comment);
      }
    });
  };

  return (
    <React.Fragment>
      <div className="reply_comment">
        {/* <div className="reply-avatar ava">
          <img
            src="https://images.unsplash.com/photo-1490894641324-cfac2f5cd077?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=70"
            alt="user icon"
          ></img>
        </div> */}
        <div className="username">@{props.replies_info.username}</div>
        <div className="date">
          <p>{props.replies_info.created_at}</p>
        </div>
        {deleteButton}
        <div className="reply_content">
          <p>{props.replies_info.comment}</p>
        </div>
      </div>
    </React.Fragment>
  );
}
