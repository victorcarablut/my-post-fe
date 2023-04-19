import React from 'react';
import Posts from './Posts';

function Home() {

  return (
    <div className="container-fluid">
      <small>HomePage</small>
      <Posts filter="all"/>
    </div>
  )
}

export default Home;