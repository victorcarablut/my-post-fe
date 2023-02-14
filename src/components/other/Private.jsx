import { useEffect } from "react";


function Private() {

  useEffect(() => {
   console.log("Private");
  }, []);

  return (
    <div>Private</div>
  )
}

export default Private;