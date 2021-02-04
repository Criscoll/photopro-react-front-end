import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './CapturePhotoPage.css';

import TitleField from './Textfields/TitleField';
import CaptionField from './Textfields/CaptionField';
import TagsField from './Textfields/TagsField';
import PriceField from './Textfields/PriceField';
import ImageUploader from 'react-images-upload';
import PostConfirmationModal from './PostConfirmationModal/PostConfirmationModal';

async function attemptPost(img, title, caption, price, tags) {
  const form_data = new FormData();
  form_data.append('image', img);
  form_data.append('caption', caption);
  form_data.append('title', title);
  form_data.append('price', price);
  form_data.append('tags', tags);

  const response = await axios.post('https://photo-pro.herokuapp.com//post', form_data);
  return response;
}

export default function CapturePhotoPage(props) {
  const [img, setImg] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [uploadButtonClicked, setUploadButtonClicked] = useState(false);
  const [titleValidated, setTitleValidated] = useState(false);
  const [captionValidated, setCaptionValidated] = useState(false);
  const [priceValidated, setPriceValidated] = useState(false);
  const [tagsValidated, setTagsValidated] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const onDrop = (pictureFiles, pictureDataURLs) => {
    setPictures(pictures.concat(pictureFiles));
    setImg(pictureDataURLs[0]);
  };

  useEffect(() => {
    console.log('called');

    if (
      titleValidated[0] &&
      captionValidated[0] &&
      priceValidated[0] &&
      tagsValidated[0] &&
      img !== null
    ) {
      console.log('approved');
      setLoading(true);
      const response = attemptPost(
        img,
        titleValidated[1],
        captionValidated[1],
        priceValidated[1],
        tagsValidated[1]
      );

      response.then((res) => {
        console.log(res);
        if (res.data.result) {
          setConfirmationModalOpen(true);
        }
        setLoading(false);
      });
    }
    // eslint-disable-next-line
  }, [titleValidated, captionValidated, priceValidated, tagsValidated]);

  const formSubmit = (event) => {
    setUploadButtonClicked(!uploadButtonClicked);
  };

  return ReactDom.createPortal(
    <React.Fragment>
      <div className="grid-container-editpost">
        <div className="grid-item-image">
          <ImageUploader
            withIcon={true}
            buttonText="Choose image"
            onChange={onDrop}
            imgExtension={['.jpg', '.png', '.jpeg']}
            maxFileSize={5242880}
            withPreview={true}
            singleImage={true}
            withLabel={true}
          />
        </div>
        <div className="edit-post-details">
          <TitleField
            uploadButtonClicked={uploadButtonClicked}
            setTitleValidated={setTitleValidated}
          />
          <CaptionField
            uploadButtonClicked={uploadButtonClicked}
            setCaptionValidated={setCaptionValidated}
          />
          <PriceField
            uploadButtonClicked={uploadButtonClicked}
            setPriceValidated={setPriceValidated}
          />
          <TagsField
            uploadButtonClicked={uploadButtonClicked}
            setTagsValidated={setTagsValidated}
          />
          <h4>
            Tags are important to allow our system to match users with your
            photos. We encourage the use of tags but they are not optional. Upon
            submission our system will auto-tag your image to improve its search
            appearance but you may choose to remove these by editing your post.
          </h4>
          <div className="capture-form-buttons">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={formSubmit}
            >
              SAVE
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                history.goBack();
              }}
            >
              Cancel
            </Button>
          </div>
          <h2 style={{ textAlign: 'center' }}>
            {loading && 'Upload in progress, please wait...'}
          </h2>
        </div>
      </div>
      {confirmationModalOpen ? <PostConfirmationModal isOpen={true} /> : null}
    </React.Fragment>,
    document.getElementById('editPostPortal')
  );
}
