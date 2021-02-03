import React, { useState, useEffect } from 'react';
import './MyPurchasesFeed.css';
import PurchasedImage from './purchasedImage/PurchasedImage';

const MyPurchasedFeed = (props) => {
  const [purchasedImgs, setPurchasedImgs] = useState([]);
  const { retrievedImgs } = props;

  useEffect(() => {
    setPurchasedImgs(retrievedImgs);
  }, [retrievedImgs]);

  console.log(purchasedImgs);

  return (
    <React.Fragment>
      <div className="image-grid">
        {purchasedImgs.map((image) => {
          if (image === null) {
            return null;
          }

          return <PurchasedImage key={image.image_id} image={image} />;
        })}
      </div>
    </React.Fragment>
  );
};

export default MyPurchasedFeed;
