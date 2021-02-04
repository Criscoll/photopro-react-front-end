import React from 'react';

import MainPage from './pages/MainPage';
// import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ProfilePage from './pages/ProfilePage';
import PostInfo from './pages/PostInfo/PostInfo';
import CapturePhotoPage from './pages/UploadPhotoPage/CapturePhotoPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
// import EditPostPage from './pages/EditPostPage';
import CollectionsPage from './pages/collections/CollectionsPage';
import CollectionDataPage from './pages/collections/CollectionsDataPage';
import ShoppingCartPage from './pages/shoppingCartPage/ShoppingCartPage';
import CheckoutPage from './pages/checkoutPage/CheckoutPage';
import MyPurchases from './pages/myPurchases/MyPurchases';
import RecommendationsPage from './pages/RecommendationsPage/RecommendationsPage';
import UploadProfilePage from './pages/uploadProfilePage/UploadProfilePage';

import { Switch, Route } from 'react-router-dom';

function App() {
  return (
    <React.Fragment>
      <Switch>
        <Route path="/" exact>
          <MainPage />
        </Route>
        {/* <Route path="/login">
          <LoginPage />
        </Route> */}
        <Route path="/signup">
          <RegistrationPage />
        </Route>
        <Route path="/changepassword" component={ChangePasswordPage} />
        <Route path="/forgotpassword" component={ForgotPasswordPage} />
        <Route path="/profile/:userID" component={ProfilePage} />
        <Route path="/uploadphoto" component={CapturePhotoPage} />
        <Route path="/post-:id" component={PostInfo} />
        {/* <Route path="/editpost/:id" component={EditPostPage} /> */}
        <Route path="/collections/:userID" component={CollectionsPage} />
        <Route path="/collection-:id" component={CollectionDataPage} />
        <Route path="/shopping-cart" component={ShoppingCartPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/my-purchases" component={MyPurchases} />
        <Route path="/recommendations" component={RecommendationsPage} />
        <Route path="/upload-profile-photo" component={UploadProfilePage} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
