// src/components/CheckInCamera.js
import React, { useEffect, useRef } from 'react';
import '../../../../styles/CheckIn.css';

export default function CheckInCamera({ onClose }) {
  const videoRef = useRef(null);

useEffect(() => {
  let stream;

  const startCamera = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
    }
  };

  startCamera();

  return () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };
}, []);

  return (
  <div className="camera-wrapper">
    <video ref={videoRef} className="camera-feed" playsInline muted />
    
    <div className="scan-highlight">
      <span></span>
    </div>

    <button className="btn-fechar" onClick={onClose}>X</button>
  </div>
);

}
