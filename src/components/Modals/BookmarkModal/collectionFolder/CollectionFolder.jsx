import React from 'react';
import './CollectionFolder.css';
import Button from '@material-ui/core/Button';

export default function CollectionFolder(props) {
  console.log(props.collectionInfo);

  const handleCollectionPicked = () => {
    props.addPhotoToCollections(props.collectionInfo.collection_id);
  };

  return (
    <React.Fragment>
      <div className="collection_folder">
        <Button variant="contained" onClick={handleCollectionPicked}>
          {props.collectionInfo.collection_name}
        </Button>
      </div>
    </React.Fragment>
  );
}
