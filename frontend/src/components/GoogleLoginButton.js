import React, { useEffect } from 'react';

export default function GoogleLoginButton({ onSuccess }) {
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "SUA_CLIENT_ID_AQUI",
        callback: handleCredentialResponse,
      });
      google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "filled_black", size: "large", text: "signin_with" }
      );
    }
  }, []);

  const handleCredentialResponse = (response) => {
    console.log('Google Token:', response.credential);
    // Envie para o backend
    onSuccess(response.credential);
  };

  return (
    <div id="googleSignInDiv"></div>
  );
}
