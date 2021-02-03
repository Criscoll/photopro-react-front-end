import React, { useState, useEffect } from "react";

export default function ReplyForm() {
  const [show_reply_form, set_show_reply_form] = useState(false);

  return (
    <React.Fragment>
      {show_reply_form ? (
        <div className="reply_form">
          <form onSubmit={handleReplySubmitted}>
            <div>
              <input
                type="reply"
                id="reply_input"
                value={reply_input}
                onChange={(e) => set_reply_input(e.target.value)}
              />
            </div>
          </form>
        </div>
      ) : null}
    </React.Fragment>
  );
}
