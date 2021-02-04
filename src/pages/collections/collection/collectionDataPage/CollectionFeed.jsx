import React, { useState, useEffect } from "react";
import "./CollectionFeed.css";
import CollectionImage from "./collectionImage/CollectionImage";

const CollectionFeed = (props) => {
  const [collectionImgs, setCollectionImgs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photoIdBookmarked, setPhotoIdBookmarked] = useState(0);

  const { retrievedImgs } = props;

  useEffect(() => {
    setCollectionImgs(retrievedImgs);
  }, [retrievedImgs]);

  return (
    <React.Fragment>
      <div className="image-grid">
        {collectionImgs.map((image, index) => {
          if (image === null) {
            return null;
          }

          return (
            <CollectionImage
              key={index}
              image={image}
              openBookmarkModal={modalIsOpen}
              setOpenBookmarkModal={setModalIsOpen}
              setPhotoId={setPhotoIdBookmarked}
            />
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default CollectionFeed;
