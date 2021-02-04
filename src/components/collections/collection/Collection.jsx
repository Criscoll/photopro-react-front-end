import React from "react";
import LockIcon from "@material-ui/icons/Lock";
import { makeStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";

import "./Collection.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    minWidth: 300,
    width: "100%",
  },
  image: {
    position: "relative",
    height: 200,
    [theme.breakpoints.down("xs")]: {
      width: "100% !important", // Overrides inline-style
      height: 100,
    },
    "&:hover, &$focusVisible": {
      zIndex: 1,
      "& $imageBackdrop": {
        opacity: 0.15,
      },
      "& $imageMarked": {
        opacity: 0,
      },
      "& $imageTitle": {
        border: "4px solid currentColor",
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%",
  },
  imageBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create("opacity"),
  },
  imageTitle: {
    position: "relative",
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${
      theme.spacing(1) + 6
    }px`,
    fontSize: 28,
    fontWeight: "bold",
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity"),
  },
}));

export default function Collection(props) {
  const handleCollectionClicked = () => {
    props.setCollectionClicked(true);
    props.setCollectionIdClicked(props.collection.collection_id);
    props.setCollectionNameClicked(props.collection.collection_name);
    props.setCollectionPrivateClicked(props.collection.private);
    props.setCollectionNumPhotosClicked(props.collection.num_photos);
    props.setCollectionCreatorClicked(props.collection.creator_id);
  };

  const classes = useStyles();

  const image = {
    url: props.collection.img,
    title: props.collection.collection_name,
    width: "100%",
  };

  let img = "data:image;base64," + image.url.replace(/(\r\n|\n|\r)/gm, "");

  // console.log(img);

  return (
    <React.Fragment>
      <div className="collection-box" onClick={handleCollectionClicked}>
        <div className={classes.root}>
          <ButtonBase
            focusRipple
            key={image.title}
            className={classes.image}
            focusVisibleClassName={classes.focusVisible}
            style={{
              width: image.width,
            }}
          >
            <span
              className={classes.imageSrc}
              style={{
                backgroundImage: `url(${img})`,
              }}
            />
            <span className={classes.imageBackdrop} />
            <span className={classes.imageButton}>
              <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                className={classes.imageTitle}
              >
                {props.collection.private === true ? <LockIcon /> : null}
                {image.title}

                <span className={classes.imageMarked} />
              </Typography>
            </span>
          </ButtonBase>
        </div>
        {/* {props.collection.private === true ? <LockIcon /> : null} */}
        {/* {props.collection.collection_name} */}
      </div>
    </React.Fragment>
  );
}
