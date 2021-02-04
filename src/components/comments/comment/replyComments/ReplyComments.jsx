import React, { useState, useEffect } from 'react';
import './ReplyComments.css';
import axios from 'axios';
import ReplyComment from './replyComment/ReplyComment';

export default function ReplyComments(props) {
  const [replies, set_replies] = useState([]);
  const [replyUpdated, updateReplies] = useState('');

  const { newReply, comment_id, setShowViewReplies, updateComments } = props;

  useEffect(() => {
    const getReplies = () => {
      axios({
        method: 'GET',
        url: 'http://localhost:5000/get_comments_to_comment',
        params: {
          comment_id: comment_id,
          batch_size: 10,
        },
      }).then((response) => {
        console.log(response);
        if (response.data.result) {
          set_replies(response.data.result);
        } else {
          console.log('NO REPLIES FOUND');
          set_replies([]);
          setShowViewReplies(false);
          updateComments(comment_id);
        }
      });
    };
    getReplies();
  }, [replyUpdated, newReply, comment_id, setShowViewReplies, updateComments]);

  const replies_components = replies.map((reply) => {
    return (
      <ReplyComment
        key={reply.comment_id}
        replies_info={reply}
        updateReplies={updateReplies}
      />
    );
  });

  return (
    <React.Fragment>
      <div className="reply_comments">{replies_components}</div>
    </React.Fragment>
  );
}
