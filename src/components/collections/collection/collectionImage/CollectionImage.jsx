import React, { Component } from 'react';
import axios from 'axios';
import './CollectionImage.css';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import PostModal from '../../../Modals/PostModal/PostModal';
import AddedToCartModal from '../../../Modals/AddedToCartModal/AddedToCartModal';

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

class CollectionImage extends Component {
  constructor(props) {
    super(props);

    // CreateRef is used to access the DOM
    // after accessing the DOM, we can get the height of each ImageCard
    this.imageRef = React.createRef();
    this.setOpenPostModal = this.setOpenPostModal.bind(this);
    this.setAddedToCartModal = this.setAddedToCartModal.bind(this);
    this.setCartStatus = this.setCartStatus.bind(this);
    this.setNumLikesDummy = this.setNumLikesDummy.bind(this);
    this.setNumLikes = this.setNumLikes.bind(this);
    this.setRelatedImagesClicked = this.setRelatedImagesClicked.bind(this);

    this.state = {
      openPostModal: false,
      openRelatedPostModal: false,
      openCartAddedModal: false,
      cartStatus: '',
      spans: 0,
      animateImages: '',
      numLikes: this.props.image.num_likes,
      relatedImageClicked: {},
    };

    this.collection_id = props.image.collection_id;
    this.image_id = props.image.id;
  }

  componentDidMount() {
    this.imageRef.current.addEventListener('load', this.setSpans);
    setTimeout(() => {
      this.setState({
        animateImages: 'image-container-animate',
      });
    }, 100);

    console.log(`isMyCollection=${this.props.isMyCollection}`);
  }

  setSpans = () => {
    if (this.imageRef.current != null) {
      const height = this.imageRef.current.clientHeight;
      const spansRows = Math.ceil(height / 10);
      this.setState({ spans: spansRows });
    }
  };

  setAddedToCartModal = (newState) => {
    this.setState({ openCartAddedModal: newState });
  };

  setCartStatus = (newState) => {
    this.setState({ cartStatus: newState });
  };

  setOpenPostModal = (newState) => {
    this.setState({ openPostModal: newState });
  };

  setNumLikes = (newState) => {
    this.setState({ numLikes: newState });
  };

  setNumLikesDummy = () => {
    console.log('dummy like for related image');
  };

  setRelatedImagesClicked = (newState) => {
    console.log(newState);
    this.setState({
      relatedImageClicked: newState,
      openPostModal: false,
      openRelatedPostModal: true,
    });
  };

  handleBuyClicked = (e) => {
    e.stopPropagation();

    const apiAddToCart = (imageID, setModal, setCartStatus) => {
      axios({
        method: 'POST',
        url: 'https://photo-pro.herokuapp.com//add_purchase',
        params: {
          save_for_later: 0,
          purchased: 0,
          image_id: String(imageID),
        },
      }).then((response) => {
        if (response.data.result !== false) {
          setModal(true);
          setCartStatus('added');
        }
      });
    };

    const apiRemoveFromCart = (imageID, setModal, setCartStatus) => {
      axios({
        method: 'POST',
        url: 'https://photo-pro.herokuapp.com//delete_item_from_cart',
        params: {
          image_id: String(imageID),
        },
      }).then((response) => {
        if (response.data.result !== false) {
          setModal(true);
          setCartStatus('removed');
        }
      });
    };

    axios({
      url: 'https://photo-pro.herokuapp.com//item_is_in_cart',
      params: { image_id: this.props.image.id },
    }).then((response) => {
      console.log(response);
      if (!response.data.result) {
        apiAddToCart(
          this.props.image.id,
          this.setAddedToCartModal,
          this.setCartStatus
        );
      } else {
        apiRemoveFromCart(
          this.props.image.id,
          this.setAddedToCartModal,
          this.setCartStatus
        );
      }
    });
  };

  handleImageClicked = (e) => {
    this.setState({ openPostModal: true });
  };

  handleDeleteClicked = (e) => {
    const deletePhotoFromCollection = () => {
      axios({
        method: 'GET',
        url: 'https://photo-pro.herokuapp.com//delete_photo_from_collection',
        params: { collection_id: this.collection_id, image_id: this.image_id }, //user_id: 1
      }).then((res) => {
        console.log(res);
      });
    };

    deletePhotoFromCollection();
    e.stopPropagation();
    window.location.reload();
  };

  render() {
    let component;

    component = (
      <React.Fragment>
        {/* // <div style={{ gridRowEnd: `span ${this.state.spans}` }}> */}
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
              root: `${this.props.classes.root} ${this.props.classes.likeButton}`,
            }}
            variant="contained"
            onClick={this.handleLikeClicked}
          >
            <FavoriteIcon classes={{ root: this.props.classes.likeSize }} />
            <div className="num-likes">{this.state.numLikes}</div>
          </IconButton>

          <IconButton
            classes={{
              root: `${this.props.classes.root} ${this.props.classes.buy}`,
            }}
            variant="contained"
            onClick={this.handleBuyClicked}
          >
            <ShoppingCartIcon />
          </IconButton>
          {this.props.isMyCollection === 'true' ? (
            <IconButton
              variant="contained"
              classes={{
                root: `${this.props.classes.root} ${this.props.classes.remove}`,
              }}
              onClick={this.handleDeleteClicked}
            >
              <HighlightOffIcon
                classes={{ root: `${this.props.classes.removeIcon}` }}
              />
            </IconButton>
          ) : null}
        </div>
        {this.state.openPostModal ? (
          <div
            className="modal-wrapper"
            onClick={() => {
              this.setState({ openPostModal: false });
            }}
          >
            <PostModal
              openModal={true}
              setOpenModal={this.setOpenPostModal}
              imageID={this.props.image.id}
              url={this.props.image.img}
              caption={this.props.image.caption}
              price={this.props.image.price}
              title={this.props.image.title}
              uploader={this.props.image.uploader}
              setNumLikes={this.setNumLikes}
              setRelatedImagesClicked={this.setRelatedImagesClicked}
            />
          </div>
        ) : null}

        {this.state.openRelatedPostModal ? (
          <div
            className="modal-wrapper"
            onClick={() => {
              this.setState({ openRelatedPostModal: false });
            }}
          >
            this.state.relatedImageClicked ?
            <PostModal
              openModal={true}
              setOpenModal={this.setOpenPostModal}
              imageID={this.state.relatedImageClicked.id}
              url={this.state.relatedImageClicked.img}
              caption={this.state.relatedImageClicked.caption}
              price={this.state.relatedImageClicked.price}
              title={this.state.relatedImageClicked.title}
              uploader={this.state.relatedImageClicked.uploader}
              setNumLikes={this.setNumLikesDummy}
              setRelatedImagesClicked={this.setRelatedImagesClicked}
            />
          </div>
        ) : null}

        {this.state.openCartAddedModal ? (
          <div
            className="modal-wrapper"
            onClick={() => {
              this.setState({ openCartAddedModal: false });
            }}
          >
            <AddedToCartModal
              openModal={true}
              cartStatus={this.state.cartStatus}
            />
          </div>
        ) : null}
      </React.Fragment>
    );

    return <React.Fragment>{component}</React.Fragment>;
  }
}

export default withStyles(styles)(CollectionImage);
