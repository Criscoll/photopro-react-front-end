import React, { useState, useEffect } from 'react';
import './searchbar.css';
import axios from 'axios';
import Feed from '../feed/feed';
import SearchBarInput from './searchBarInput';

import img1 from '../../background/1.jpg';
import img2 from '../../background/2.jpg';
import img3 from '../../background/3.jpg';
import img4 from '../../background/4.jpg';
import img5 from '../../background/5.jpg';
import img6 from '../../background/6.jpg';
import img7 from '../../background/7.jpg';

function SearchBar() {
  const [query, setQuery] = useState(null);

  useEffect(() => {
    if (query !== null) {
      const updateSearchRecommendation = () => {
        axios({
          url: 'http://localhost:5000/update_search_recommendation',
          params: { query: query },
        }).then((response) => {
          console.log(response);
        });
      };
      updateSearchRecommendation();
    }
    console.log(`The query is - ${query}`);
  }, [query]);

  let backgroundImages = [];
  let index = 0;

  backgroundImages[0] = img1;
  backgroundImages[1] = img2;
  backgroundImages[2] = img3;
  backgroundImages[3] = img4;
  backgroundImages[4] = img5;
  backgroundImages[5] = img6;
  backgroundImages[6] = img7;
  index = Math.floor(Math.random() * backgroundImages.length);
  console.log(index);

  return (
    <React.Fragment>
      <div
        className="bar"
        style={{ backgroundImage: `url(${backgroundImages[index]})` }}
      >
        <SearchBarInput setQuery={setQuery} />
      </div>

      <Feed query={query} />
    </React.Fragment>
  );
}

export default SearchBar;
