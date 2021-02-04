import React, { useState } from 'react';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import './UploadProfilePage.css';

export default function UploadProfilePage(props) {
  const [img, setImg] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [uploadedSuccessfully, setUploadedSuccessfully] = useState(false);

  const history = useHistory();

  const onDrop = (pictureFiles, pictureDataURLs) => {
    setPictures(pictures.concat(pictureFiles));
    setImg(pictureDataURLs[0]);
  };

  //   console.log(img);

  async function postProfilePhoto() {
    const form_data = new FormData();
    form_data.append('image', img);

    const response = await axios.post(
      'http://localhost:5000/post_profile_photo',
      form_data
    );
    return response;
  }

  const deleteProfilePhoto = () => {
    axios({
      method: 'POST',
      url: 'http://localhost:5000/delete_profile_photo',
    }).then((response) => {
      console.log(response);
      const postPhotoResponse = postProfilePhoto();
      postPhotoResponse.then((res) => {
        console.log(res);
        if (res.data.result === true) {
          console.log('Uploaded successfully');
          if (img !== null) {
            setUploadedSuccessfully(true);
            setTimeout(() => {
              history.goBack();
            }, 500);
          }
        }
      });
    });
  };

  const handleSaveProfileClicked = () => {
    deleteProfilePhoto();
  };

  return (
    <React.Fragment>
      <div className="upload-image-wrapper">
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
        {uploadedSuccessfully === true ? (
          <h2 style={{ textAlign: 'center', color: 'grey' }}>
            Profile photo is uploaded successfully!
          </h2>
        ) : null}
        <div className="profile-button-wrapper">
          <div>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSaveProfileClicked}
            >
              Save Profile Photo
            </Button>
          </div>
          <div style={{ marginBottom: '10%' }}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => {
                history.goBack();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
