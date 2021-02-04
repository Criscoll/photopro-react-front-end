import React, { Component } from "react";

const PostPhoto = (props) => {
  console.log("postimage");
  console.log(props);
  return (
    <React.Fragment>
      <div>
        <img
          src={`data:image/jpg;base64,${props.image.url}`}
          alt={props.image.caption}
        />
      </div>
    </React.Fragment>
  );
};

export default PostPhoto;
