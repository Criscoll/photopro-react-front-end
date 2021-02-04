import React, { useState, useEffect } from 'react';
import './CheckoutPage.css';
import ToolBar from '../../components/toolbar/toolbar';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import CheckoutItem from './checkoutItem/CheckoutItem';
import { useHistory } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal/ConfirmationModal';

import CardName from './textfields/CardName';
import CardNum from './textfields/CardNum';
import CardMonth from './textfields/CardMonth';
import CardYear from './textfields/CardYear';
import CardCvv from './textfields/CardCvv';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 'ch',
    },
  },
}));

export default function CheckoutPage(props) {
  const [shoppingCartItems, setShoppingCartItems] = useState([]);
  const [placeOrderClicked, setPlaceOrderClicked] = useState(false);
  const [cardNumValidated, setCardNumValidated] = useState(false);
  const [cardNameValidated, setCardNameValidated] = useState(false);
  const [cardMonthValidated, setCardMonthValidated] = useState(false);
  const [cardYearValidated, setCardYearValidated] = useState(false);
  const [cardCvvValidated, setCardCvvValidated] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    const getUserNotPurchasedItems = () => {
      axios({
        method: 'GET',
        url: 'https://photo-pro.herokuapp.com//get_user_purchases',
        params: {
          save_for_later: 0,
          purchased: 0,
        },
      }).then((response) => {
        if (response.data.result !== false) {
          console.log(response);
          setShoppingCartItems(response.data.result);
        }
      });
    };
    getUserNotPurchasedItems();
  }, []);

  useEffect(() => {
    const updatePurchase = (img_id) => {
      axios({
        method: 'POST',
        url: 'https://photo-pro.herokuapp.com//update_user_purchases_details',
        params: {
          save_for_later: 0,
          purchased: 1,
          image_id: img_id,
        },
      }).then((response) => {
        console.log(response);
        setConfirmationModalOpen(true);
        setLoading(false);
      });
    };

    if (
      cardNumValidated &&
      cardYearValidated &&
      cardMonthValidated &&
      cardNameValidated &&
      cardCvvValidated
    ) {
      setLoading(true);
      shoppingCartItems.forEach((item) => {
        console.log(item.image_id);
        updatePurchase(item.image_id);
      });
    }
    // eslint-disable-next-line
  }, [
    cardNumValidated,
    cardNameValidated,
    cardYearValidated,
    cardMonthValidated,
    cardCvvValidated,
  ]);

  const handlePlaceOrderButton = () => {
    setPlaceOrderClicked(!placeOrderClicked);
  };

  const handleEditButton = () => {
    history.push('/shopping-cart');
  };

  const checkoutItemsComponents = shoppingCartItems.map((item) => {
    //console.log(item);
    return (
      <CheckoutItem
        key={item.image_id}
        image_id={item.image_id}
        img={item.img}
        price={item.price}
        title={item.title}
      />
    );
  });

  return (
    <React.Fragment>
      <ToolBar />
      <div className="checkout-wrapper" style={{ marginTop: '15%' }}>
        <h1>Checkout</h1>
        <div className="checkout-grid">
          <div className="payment-info">
            {/* <h2>Fill payment info:</h2> */}
            <form className={classes.root} noValidate autoComplete="off">
              <div className="cart-details-grid">
                <CardNum
                  placeOrderClicked={placeOrderClicked}
                  setCardNumValidated={setCardNumValidated}
                />
                <CardName
                  placeOrderClicked={placeOrderClicked}
                  setCardNameValidated={setCardNameValidated}
                />
                <CardMonth
                  placeOrderClicked={placeOrderClicked}
                  setCardMonthValidated={setCardMonthValidated}
                />
                <CardYear
                  placeOrderClicked={placeOrderClicked}
                  setCardYearValidated={setCardYearValidated}
                />
                <CardCvv
                  placeOrderClicked={placeOrderClicked}
                  setCardCvvValidated={setCardCvvValidated}
                />

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handlePlaceOrderButton}
                >
                  PLACE ORDER
                </Button>
                <h2>{loading && 'Purchase in progress, please wait...'}</h2>
              </div>
            </form>
          </div>
          <div className="purchase-info">
            <Button color="primary" onClick={handleEditButton}>
              Edit
            </Button>
            <h2>Total number of item(s): {shoppingCartItems.length}</h2>

            <h2>
              TOTAL TO PAY: $
              {Number(props.location.state.totalPrice).toFixed(2)}
            </h2>
            <div className="purchased-items">{checkoutItemsComponents}</div>
          </div>
        </div>
      </div>

      {confirmationModalOpen ? <ConfirmationModal isOpen={true} /> : null}
    </React.Fragment>
  );
}
