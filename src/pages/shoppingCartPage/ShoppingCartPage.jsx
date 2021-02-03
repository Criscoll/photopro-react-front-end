import React, { useState, useEffect } from 'react';
import ToolBar from '../../components/toolbar/toolbar';
import ShoppingItem from './shoppingItem/ShoppingItem';
import Button from '@material-ui/core/Button';
import axios from 'axios';

import { Redirect } from 'react-router-dom';

import './ShoppingCartPage.css';

export default function ShoppingCart() {
  const [checkoutButtonClicked, setCheckoutButtonClicked] = useState(false);

  const [shoppingCartItems, setShoppingCartItems] = useState([]);

  const [savedLaterItems, setSavedLaterItems] = useState([]);

  const [moveButtonClicked, setMoveButtonClicked] = useState(false);

  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);

  const getUserNotPurchasedItems = () => {
    axios({
      method: 'GET',
      url: 'http://localhost:5000/get_user_purchases',
      params: {
        save_for_later: 0,
        purchased: 0,
      },
    }).then((response) => {
      if (response.data.result !== false) {
        console.log(response);
        setShoppingCartItems(response.data.result);
      }

      getUserSavedLaterItems();
    });
  };

  const getUserSavedLaterItems = () => {
    axios({
      method: 'GET',
      url: 'http://localhost:5000/get_user_purchases',
      params: {
        save_for_later: 1,
        purchased: 0,
      },
    }).then((response) => {
      if (response.data.result !== false) {
        console.log(response);
        if (response.data) {
          console.log(response.data.result);
          setSavedLaterItems(response.data.result);
        }
      }
    });
  };

  useEffect(() => {
    getUserNotPurchasedItems();
    console.log('rerendering shopping page');
    // eslint-disable-next-line
  }, [moveButtonClicked, deleteButtonClicked]);

  const handleCheckoutButton = () => {
    setCheckoutButtonClicked(true);
  };

  const shoppingItems = shoppingCartItems.map((item) => {
    //console.log(item);
    return (
      <ShoppingItem
        key={item.image_id}
        caption={item.caption}
        image_id={item.image_id}
        img={item.img}
        price={item.price}
        purchased={item.purchased}
        save_for_later={item.save_for_later}
        title={item.title}
        setMoveButtonClicked={setMoveButtonClicked}
        moveButtonClicked={moveButtonClicked}
        setDeleteButtonClicked={setDeleteButtonClicked}
        deleteButtonClicked={deleteButtonClicked}
      />
    );
  });

  //console.log(savedLaterItems);

  const savedLaterItemsComponents = savedLaterItems.map((item) => {
    //console.log(item);
    return (
      <ShoppingItem
        key={item.image_id}
        caption={item.caption}
        image_id={item.image_id}
        img={item.img}
        price={item.price}
        purchased={item.purchased}
        save_for_later={item.save_for_later}
        title={item.title}
        setMoveButtonClicked={setMoveButtonClicked}
        moveButtonClicked={moveButtonClicked}
        setDeleteButtonClicked={setDeleteButtonClicked}
        deleteButtonClicked={deleteButtonClicked}
      />
    );
  });

  let subTotal = 0;
  shoppingCartItems.forEach((item) => {
    subTotal += parseFloat(item.price);
  });

  console.log(subTotal);

  const checkoutComponent = (
    <Redirect
      push
      to={{
        pathname: `/checkout`,
        state: {
          totalPrice: `${Number(subTotal).toFixed(2)}`,
        },
      }}
    />
  );

  console.log(shoppingItems);

  let componentsRender;
  if (checkoutButtonClicked) {
    componentsRender = checkoutComponent;
  } else {
    componentsRender = (
      <div className="shopping-cart-page">
        <div className="shopping-cart">
          <h1>My Shopping Cart</h1>
          <div className="shopping-cart-grid">
            <div className="shopping-cart-items">{shoppingItems}</div>
            <div className="shopping-cart-subtotal">
              <h2>
                Subtotal ({shoppingCartItems.length} items): $
                {Number(subTotal).toFixed(2)}
              </h2>

              {shoppingCartItems.length > 0 ? (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleCheckoutButton}
                >
                  Proceed to Checkout
                </Button>
              ) : null}
            </div>
          </div>
        </div>
        <div className="save-for-later">
          <h1>Saved for later</h1>
          <div className="shopping-cart-grid">
            <div className="shopping-cart-items">
              {savedLaterItemsComponents}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ToolBar />
      <div className="shopping-cart-wrapper">{componentsRender}</div>
    </React.Fragment>
  );
}
