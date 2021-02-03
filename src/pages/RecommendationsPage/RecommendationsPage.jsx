import React from 'react';
import './RecommendationsPage.css';
import Toolbar from '../../components/toolbar/toolbar';
import RecommendationFeed from '../../components/feed/RecommendationFeed/RecommendationFeed';

function RecommendationPage() {
  return (
    <React.Fragment>
      <Toolbar />
      <div className="recommendation-gap" />
      <h1 className="recommendation-text">Photos recommended for you!</h1>
      <RecommendationFeed />
    </React.Fragment>
  );
}

export default RecommendationPage;
