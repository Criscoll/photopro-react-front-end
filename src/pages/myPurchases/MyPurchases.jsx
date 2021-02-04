import React, { useState, useEffect } from "react";
import "./MyPurchases.css";
import ToolBar from "../../components/toolbar/toolbar";
import axios from "axios";
import MyPurchasesFeed from "./myPurchasesFeed/MyPurchasesFeed";

export default function MyPurchases() {
  const [boughtItems, setBoughtItems] = useState([]);

  useEffect(() => {
    getUserNotPaidItems();
  }, []);

  const getUserNotPaidItems = () => {
    axios({
      method: "GET",
      url: "https://photo-pro.herokuapp.com//get_user_purchases",
      params: {
        save_for_later: 0,
        purchased: 1,
      },
    }).then((response) => {
      if (response.data.result !== false) {
        console.log(response);
        setBoughtItems(response.data.result);
      }
    });
  };

  return (
    <React.Fragment>
      <ToolBar />
      <div className="my-purchases-wrapper" style={{ marginTop: "15%" }}>
        <h1>My purchases</h1>
        <div className="my-purchases-feed">
          <MyPurchasesFeed retrievedImgs={boughtItems} />
        </div>
      </div>
    </React.Fragment>
  );
}
