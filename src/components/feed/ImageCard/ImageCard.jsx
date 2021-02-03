import React, { Component } from 'react';
import axios from 'axios';
import './ImageCard.css';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PostModal from '../../Modals/PostModal/PostModal';
import AddedToCartModal from '../../Modals/AddedToCartModal/AddedToCartModal';
import EditPostModal from '../../Modals/EditPostModal/EditPostModal';

const deletePostRequest = async function (imageID) {
  const response = await axios.get('http://localhost:5000/delete_image_post', {
    params: { image_id: String(imageID) }, //user_id: 1
  });

  return response;
};

// matrial-ui component style override
const styles = {
  root: {
    position: 'absolute',
    bottom: '0%',
    left: '50%',
    color: 'rgba(255, 255, 255,1)',
    height: '15%',
    width: '15%',
  },
  iconSize: {
    width: '60%',
    height: '60%',
  },
  likeSize: {
    width: '80%',
    height: '80%',
  },
  like: {
    left: '5%',
  },
  bookmark: {
    left: '60%',
  },
  buy: {
    left: '80%',
  },
  delete: {
    left: '4%',
    top: '10%',
    width: '16%',
    height: '20%',
    '&:hover': {
      backgroundColor: 'rgba(180, 65, 65, 0.82)',
    },
  },
  edit: {
    left: '82%',
    top: '10%',
    width: '14%',
    height: '18%',
    '&:hover': {
      backgroundColor: 'rgba(6, 149, 193, 0.7)',
    },
  },
};

class ImageCard extends Component {
  constructor(props) {
    super(props);

    // CreateRef is used to access the DOM
    // after accessing the DOM, we can get the height of each ImageCard
    this.imageRef = React.createRef();
    this.setOpenPostModal = this.setOpenPostModal.bind(this);
    this.setOpenEditPostModal = this.setOpenEditPostModal.bind(this);
    this.setAddedToCartModal = this.setAddedToCartModal.bind(this);
    this.setCartStatus = this.setCartStatus.bind(this);
    this.setNumLikesDummy = this.setNumLikesDummy.bind(this);
    this.setNumLikes = this.setNumLikes.bind(this);

    this.setRelatedImagesClicked = this.setRelatedImagesClicked.bind(this);

    this.state = {
      openPostModal: false,
      openEditPostModal: false,
      openRelatedPostModal: false,
      openCartAddedModal: false,
      cartStatus: '',
      spans: 0,
      animateImages: '',
      numLikes: this.props.image.num_likes,
      relatedImageClicked: {},
    };
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

  setAddedToCartModal = (newState) => {
    this.setState({ openCartAddedModal: newState });
  };

  setCartStatus = (newState) => {
    this.setState({ cartStatus: newState });
  };

  setOpenPostModal = (newState) => {
    this.setState({ openPostModal: newState });
  };

  setOpenEditPostModal = (newState) => {
    this.setState({ openEditPostModal: newState });
  };

  setNumLikes = (newState) => {
    this.setState({ numLikes: newState });
  };

  setNumLikesDummy = (newState) => {
    console.log('dummy like for related image');
  };

  setRelatedImagesClicked = (newState) => {
    this.setState({
      relatedImageClicked: newState,
      openPostModal: false,
      openRelatedPostModal: true,
    });
  };

  handleImageClicked = (e) => {
    this.setState({ openPostModal: true });
  };

  handleLikeClicked = (e) => {
    e.stopPropagation();
  };

  handleBookmarkClicked = (e) => {
    e.stopPropagation();
    this.props.setOpenBookmarkModal(true);
    this.props.setPhotoId(parseInt(this.props.image.id));
  };

  handleBuyClicked = (e) => {
    e.stopPropagation();

    const apiAddToCart = (imageID, setModal, setCartStatus) => {
      axios({
        method: 'POST',
        url: 'http://localhost:5000/add_purchase',
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
        url: 'http://localhost:5000/delete_item_from_cart',
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
      url: 'http://localhost:5000/item_is_in_cart',
      params: { image_id: this.props.image.id },
    }).then((response) => {
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

  handleDeleteClicked = (e) => {
    deletePostRequest(this.props.image.id);
    e.stopPropagation();
    window.location.reload();
  };

  handleEditClicked = (e) => {
    e.stopPropagation();
    this.setState({ openEditPostModal: true });
  };

  render() {
    document.body.style.overflow = this.state.openPostModal
      ? 'hidden'
      : 'unset';

    let component;

    let uploaderID = String(this.props.image.uploader);
    let userID = localStorage.getItem('userID');

    let deleteButton =
      uploaderID === userID ? (
        <IconButton
          variant="contained"
          classes={{
            root: `${this.props.classes.root} ${this.props.classes.delete}`,
          }}
          onClick={this.handleDeleteClicked}
        >
          <DeleteIcon />
        </IconButton>
      ) : null;

    let editButton =
      uploaderID === userID ? (
        <IconButton
          variant="contained"
          classes={{
            root: `${this.props.classes.root} ${this.props.classes.edit}`,
          }}
          onClick={this.handleEditClicked}
        >
          <EditIcon />
        </IconButton>
      ) : null;

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
              root: `${this.props.classes.root} ${this.props.classes.like}`,
            }}
            variant="contained"
            onClick={this.handleLikeClicked}
          >
            <FavoriteIcon classes={{ root: this.props.classes.likeSize }} />
            <div className="num-likes">{this.state.numLikes}</div>
          </IconButton>
          {this.props.userLoggedIn ? (
            <React.Fragment>
              {!this.props.displayMyProfile ? (
                <React.Fragment>
                  <IconButton
                    classes={{
                      root: `${this.props.classes.root} ${this.props.classes.bookmark}`,
                    }}
                    variant="contained"
                    onClick={this.handleBookmarkClicked}
                  >
                    <BookmarkIcon />
                  </IconButton>

                  {parseInt(localStorage.getItem('userID')) !==
                  this.props.image.uploader ? (
                    <IconButton
                      classes={{
                        root: `${this.props.classes.root} ${this.props.classes.buy}`,
                      }}
                      variant="contained"
                      onClick={this.handleBuyClicked}
                    >
                      <ShoppingCartIcon />
                    </IconButton>
                  ) : null}
                </React.Fragment>
              ) : null}
              {deleteButton}
              {editButton}
            </React.Fragment>
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

        {this.state.openEditPostModal ? (
          <div
            className="modal-wrapper"
            onClick={() => {
              this.setState({ openEditPostModal: false });
            }}
          >
            <EditPostModal
              openModal={this.state.openEditPostModal}
              setOpenModal={this.setOpenEditPostModal}
              imageID={this.props.image.id}
              url={this.props.image.img}
              caption={this.props.image.caption}
              price={this.props.image.price}
              title={this.props.image.title}
              uploader={this.props.image.uploader}
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

export default withStyles(styles)(ImageCard);
