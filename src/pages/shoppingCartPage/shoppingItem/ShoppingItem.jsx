import React from "react";
import Button from "@material-ui/core/Button";
import "./ShoppingItem.css";
import axios from "axios";

export default function ShoppingItem(props) {
  const updatePurchase = (save_later_value) => {
    axios({
      method: "POST",
      url: "http://localhost:5000/update_user_purchases_details",
      params: {
        save_for_later: save_later_value,
        purchased: 0,
        image_id: props.image_id,
      },
    }).then((response) => {
      console.log(response);
      if (response.data.result !== false) {
        props.setMoveButtonClicked(!props.moveButtonClicked);
      }
    });
  };

  const deleteItem = () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/delete_item_from_cart",
      params: {
        image_id: props.image_id,
      },
    }).then((response) => {
      if (response.data.result !== false) {
        console.log(response);
        props.setDeleteButtonClicked(!props.deleteButtonClicked);
      }
    });
  };

  const handSaveLaterOrMoveCartButton = () => {
    console.log("save later clicked");
    if (props.save_for_later === true) {
      console.log("save_for_later is true->change to move to cart");
      updatePurchase(0);
    } else {
      updatePurchase(1);
    }
  };

  const handleDeleteButton = () => {
    deleteItem();
  };

  console.log(props.save_for_later);

  return (
    <React.Fragment>
      <div className="shopping-item">
        <div className="shopping-item-grid">
          <div className="image">
            <img
              src={`data:image/jpg;base64,${props.img}`}
              alt={props.caption}
            />
          </div>
          <div className="image-info">
            <h2>Title: {props.title}</h2>
            <h2>Caption:</h2>
            <p>{props.caption}</p>
            <h3>Price: ${props.price}</h3>

            <Button
              variant="outlined"
              color="primary"
              onClick={handSaveLaterOrMoveCartButton}
            >
              {props.save_for_later === true
                ? "Move to Cart"
                : "Save for Later"}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleDeleteButton}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
