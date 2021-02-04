import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './EditPostModal.css';

import TitleField from './textfields/TitleField';
import CaptionField from './textfields/CaptionField';
import TagsField from './textfields/TagsField';
import PriceField from './textfields/PriceField';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 'ch',
    },
  },
}));

export default function EditPostPage(props) {
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const [titleValidated, setTitleValidated] = useState([false, props.title]);
  const [captionValidated, setCaptionValidated] = useState([
    false,
    props.caption,
  ]);
  const [priceValidated, setPriceValidated] = useState([false, props.price]);
  const [tagsValidated, setTagsValidated] = useState([false, []]);
  const [oldTags, setOldTags] = useState([]);

  useEffect(() => {
    axios({
      url: 'https://photo-pro.herokuapp.com//get_tags',
      params: { image_id: props.imageID },
    }).then((res) => {
      console.log(res);
      if (res.data.result) {
        setOldTags(res.data.result);
        setTagsValidated([false, res.data.result]);
      }
    });
    // eslint-disable-next-line
  }, []);

  // const { match } = props;
  const history = useHistory();

  const classes = useStyles();

  async function edit_post() {
    // event.preventDefault();

    var response = await axios.get('https://photo-pro.herokuapp.com//edit_post', {
      params: {
        image_id: props.imageID,
        title: titleValidated[1],
        price: priceValidated[1],
        caption: captionValidated[1],
        tags: tagsValidated[1].toString(),
      },
    });
    return response;
  }

  useEffect(() => {
    console.log(titleValidated);
    console.log(captionValidated);
    console.log(priceValidated);
    console.log(tagsValidated);

    if (
      titleValidated[0] &&
      captionValidated[0] &&
      priceValidated[0] &&
      tagsValidated[0]
    ) {
      console.log('APPROVED');
      const response = edit_post();
      response.then((res) => {
        console.log(res);
        if (res.data.result) {
          history.go(0);
        }
      });
    }
    // eslint-disable-next-line
  }, [titleValidated, captionValidated, priceValidated, tagsValidated]);

  const handleSaveButton = () => {
    setSaveButtonClicked(!saveButtonClicked);
  };

  if (!props.openModal) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="overlayStyles" />
        <div
          className="editPostModal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="grid-container-editpost">
            <div className="grid-item-image">
              <img
                src={`data:image/jpg;base64,${props.url}`}
                alt={props.caption}
              />
            </div>
            <form className={classes.root} noValidate autoComplete="off">
              <div className="edit-post-details">
                <TitleField
                  saveButtonClicked={saveButtonClicked}
                  setTitleValidated={setTitleValidated}
                  oldTitle={props.title}
                />
                <CaptionField
                  saveButtonClicked={saveButtonClicked}
                  setCaptionValidated={setCaptionValidated}
                  oldCaption={props.caption}
                />
                <TagsField
                  saveButtonClicked={saveButtonClicked}
                  setTagsValidated={setTagsValidated}
                  oldTags={oldTags}
                />
                <PriceField
                  saveButtonClicked={saveButtonClicked}
                  setPriceValidated={setPriceValidated}
                  oldPrice={props.price}
                />

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSaveButton}
                >
                  SAVE
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => {
                    props.setOpenModal(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
            {/* <form className="grid-item-form" onSubmit={edit_post}>
              <FormGroup controlId="title" bsSize="large">
                <div>
                  <FormLabel>Title</FormLabel>
                </div>

                <FormControl
                  Type="title"
                  value={title}
                  onChange={(e) => set_title(e.target.value)}
                  defaultValue={"HELLLLOOOOO"}
                />
              </FormGroup>

              <FormGroup controlId="price" bsSize="large">
                <div>
                  <FormLabel>Price</FormLabel>
                </div>

                <FormControl
                  Type="price"
                  value={price}
                  onChange={(e) => set_price(e.target.value)}
                />
              </FormGroup>

              <FormGroup controlId="caption" bsSize="large">
                <div>
                  <FormLabel>Caption</FormLabel>
                </div>

                <FormControl
                  Type="caption"
                  value={caption}
                  onChange={(e) => set_caption(e.target.value)}
                />
              </FormGroup>

              <FormGroup controlId="tags" bsSize="large">
                <div>
                  <FormLabel>tags</FormLabel>
                </div>

                <FormControl
                  Type="tags"
                  value={tags}
                  onChange={(e) => set_tags(e.target.value)}
                />
              </FormGroup>

              <div>
                <Button
                  variant="primary"
                  disabled={
                    !validate_caption() ||
                    !validate_title() ||
                    !validate_price() ||
                    !validate_tags()
                  }
                  type="submit"
                >
                  Submit
                </Button>
              </div>

              <Button
                onClick={() => {
                  history.push("/profile");
                }}
              >
                Cancel
              </Button>
            </form> */}
            {/* <div className="grid-item-old-values">
              <h1>Current title: {props.title}</h1>
              <h1>Current Caption: {props.caption}</h1>
              <h1>Current Price: ${props.price}</h1>
              <h1>Current Tags: ${props.tags}</h1>
            </div> */}
          </div>
        </div>
      </React.Fragment>,
      document.getElementById('editPostPortal')
    );
  }
}
