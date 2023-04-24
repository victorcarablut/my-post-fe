import React, { useEffect, useState } from 'react';

function SendEmailCodeNoReplay({email}) {

    const [emailInput, setEmailInput] = useState(null);

    useEffect(() => {
        checkInput();
    }, [])

    const checkInput = () => {

        console.log("email: " + email);

        if(!email) {
            console.log("not exists");
        } else {
            console.log("exist " + email);
        }
    }

  return (
    <div>
        SendEmailCodeNoReplay

         {email}

         {emailInput}

         
    </div>

   
  )
}

export default SendEmailCodeNoReplay;