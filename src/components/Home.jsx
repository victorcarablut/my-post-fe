import React from 'react';
import Post from './Post';

function Home() {

  return (
    <div className="container-fluid">
      <small>HomePage</small>
      <Post filter="all"/>
    </div>
  )
}

export default Home;