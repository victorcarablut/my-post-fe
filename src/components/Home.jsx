
import { useEffect } from 'react';

import Posts from './Posts';

import { VerifyToken } from './security/VerifyToken.js';
import { Logout } from './account/Logout.js';


function Home() {

  useEffect(() => {

    checkAuth();

  }, []);

  const checkAuth = async () => {
    const verifyToken = await VerifyToken();
    if (!verifyToken) {
      await Logout();
    }
  }

  return (
    <div className="container-fluid">
      <Posts filter="all" />
    </div>
  )
}

export default Home;