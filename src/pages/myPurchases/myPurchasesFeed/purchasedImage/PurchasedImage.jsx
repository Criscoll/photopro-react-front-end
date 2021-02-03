import React, { Component } from 'react';
import axios from 'axios';
import './PurchasedImage.css';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import PhotoModal from '../../../../components/Modals/PhotoModal/PhotoModal';
import DownloadConfirmationModal from '../../../../components/Modals/DownloadConfirmationModal/DownloadConfirmation';

// matrial-ui component style override
const styles = {
  root: {
    position: 'absolute',
    color: 'rgba(255, 255, 255,1)',
  },
  likeIcon: {
    width: '50%',
    height: '10%',
  },
  removeIcon: {
    width: '95%',
    height: '10%',
  },
  likeButton: {
    bottom: '0%',
    left: '5%',
    width: '20%',
    height: '15%',
  },
  buy: {
    bottom: '0%',
    left: '80%',
    width: '20%',
    height: '15%',
  },
  remove: {
    right: '0%',
    top: '0%',
    width: '15%',
    height: '25%',
    '&:hover': {
      backgroundColor: 'rgba(234, 241, 223, 0.26)',
    },
  },
};

class PurchasedImage extends Component {
  constructor(props) {
    super(props);

    // CreateRef is used to access the DOM
    // after accessing the DOM, we can get the height of each ImageCard
    this.imageRef = React.createRef();
    this.state = {
      openPhotoModal: false,
      openDownloadConfirmationModal: false,
      spans: 0,
      animateImages: '',
    };

    this.image_id = props.image.id;
  }

  componentDidMount() {
    this.imageRef.current.addEventListener('load', this.setSpans);
    setTimeout(() => {
      this.setState({
        animateImages: 'image-container-animate',
      });
    }, 100);
  }

  setSpans = () => {
    if (this.imageRef.current != null) {
      const height = this.imageRef.current.clientHeight;
      const spansRows = Math.ceil(height / 10);
      this.setState({ spans: spansRows });
    }
  };

  handleImageClicked = (e) => {
    this.setState({ openPhotoModal: true });
  };

  handleDownloadClicked = (e) => {
    const downloadPhoto = () => {
      axios({
        method: 'GET',
        url: 'http://localhost:5000/download',
        params: { image_id: this.props.image.image_id },
      }).then((res) => {
        console.log(res);
        if (res.data.result) {
          this.setState({ openDownloadConfirmationModal: true });
        }
      });
    };

    console.log('download clicked');
    downloadPhoto();
    e.stopPropagation();
  };

  render() {
    document.body.style.overflow = this.state.openPhotoModal
      ? 'hidden'
      : 'unset';
    return (
      <React.Fragment>
        {/* <div style={{ gridRowEnd: `span ${this.state.spans}` }}> */}
        <div
          className={`image-container ${this.state.animateImages}`}
          onClick={this.handleImageClicked}
        >
          <div className="icon-bar"></div>

          <img
            className="image-size"
            ref={this.imageRef}
            src={`data:image/jpg;base64,${this.props.image.img}`}
            alt={this.props.caption}
          />
          <IconButton
            classes={{
              root: `${this.props.classes.root} ${this.props.classes.buy}`,
            }}
            variant="contained"
            onClick={this.handleDownloadClicked}
          >
            <GetAppIcon />
          </IconButton>
        </div>
        {/* </div> */}

        {this.state.openPhotoModal ? (
          <div
            className="photo-modal-wrapper"
            onClick={() => {
              this.setState({ openPhotoModal: false });
            }}
          >
            <PhotoModal
              openModal={true}
              image={this.props.image.img}
              caption={this.props.caption}
            />
          </div>
        ) : null}

        {this.state.openDownloadConfirmationModal ? (
          <div
            className="photo-modal-wrapper"
            onClick={() => {
              this.setState({ openDownloadConfirmationModal: false });
            }}
          >
            <DownloadConfirmationModal openModal={true} />
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PurchasedImage);
