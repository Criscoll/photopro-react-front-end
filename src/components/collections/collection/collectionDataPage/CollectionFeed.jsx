import React, { useState, useEffect } from 'react';
import './CollectionFeed.css';
import CollectionImage from '../collectionImage/CollectionImage';

const CollectionFeed = (props) => {
  const [collectionImgs, setCollectionImgs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { retrievedImgs } = props;

  useEffect(() => {
    setCollectionImgs(retrievedImgs);
  }, [retrievedImgs]);

  return (
    <React.Fragment>
      {collectionImgs.length === 0 && props.loading === false ? (
        <h1 style={{ textAlign: 'center' }}>
          There are no photos in this collection
        </h1>
      ) : (
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
                isMyCollection={props.isMyCollection}
              />
            );
          })}
        </div>
      )}
    </React.Fragment>
  );
};

export default CollectionFeed;
