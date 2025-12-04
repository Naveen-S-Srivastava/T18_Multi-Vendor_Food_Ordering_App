import React from 'react';
import './Loading.css';

export const Spinner = ({ size = 'md', color = 'primary' }) => {
  return (
    <div className={`spinner spinner-${size} spinner-${color}`}></div>
  );
};

const Loading = ({ fullScreen = false, text = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <Spinner size="lg" />
        <p className="loading-text">{text}</p>
      </div>
    );
  }

  return (
    <div className="loading-container">
      <Spinner />
      <p className="loading-text">{text}</p>
    </div>
  );
};

export default Loading;
