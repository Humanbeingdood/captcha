'use client';

import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import loginpb from '../../proto/login_pb';

export default function LoginPage() {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [token, setToken] = useState(null);

  const captchaRef = useRef(null);

  const onCaptchaChange = async (captchaToken) => {
    if (!captchaToken) return;

    setToken(captchaToken);

    const message = loginpb.login.LoginRequest.create({
      userID,
      password,
      token: captchaToken,
    });

    const buffer = loginpb.login.LoginRequest.encode(message).finish();

    try {
      const res = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: buffer,
      });

      const responseBuffer = new Uint8Array(await res.arrayBuffer());

      const decodedResponse = loginpb.login.Response.decode(responseBuffer);
      console.log('Server response:', decodedResponse);

    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    setShowCaptcha(true);
  };

  return (
    <form className="p-6 space-y-4">
      <input
        type="text"
        placeholder="User ID"
        value={userID}
        onChange={(e) => setUserID(e.target.value)}
        className="bg-white text-black border border-gray-300 p-2 rounded w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-white text-black border border-gray-300 p-2 rounded w-full"
      />
      <button onClick={handleClick} className="bg-blue-600 text-white px-4 py-2 rounded">
        Log in
      </button>

      {showCaptcha && (
        <ReCAPTCHA
          sitekey="6Lc1hFsrAAAAAHGDLPq4pdFIH7S4nO2QWgHly1hR"
          onChange={onCaptchaChange}
          ref={captchaRef}
        />
      )}
    </form>
  );
}
