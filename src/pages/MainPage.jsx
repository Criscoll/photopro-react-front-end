import React from 'react';

import Toolbar from '../components/toolbar/toolbar';
import SearchBar from '../components/searchbar/searchbar';

function MainPage() {
  return (
    <React.Fragment>
      <Toolbar />
      <SearchBar />
    </React.Fragment>
  );
}

export default MainPage;
