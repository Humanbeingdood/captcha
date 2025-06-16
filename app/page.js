'use client'

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';


export default function Home() {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const captchaRef = useRef(null);
  const router = useRouter();

  const handleVerify = async (token) => {
    if (!token) return;

    const res = await fetch('/api/verify-captcha', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ token }),
    })

    const data = await res.json();

    if(data.success) {
      router.push('/captcha');

    } else {
      alert('captcha failed');
    }
  };

  return (
    <div className = "flex flex-col items-center justify-center min-h-screen space-y-4">
      <input type="text" className="bg-white text-black border border-gray-300 p-2 rounded"></input>
      <button onClick={() => setShowCaptcha(true)}>
        enter
      </button>

      {showCaptcha && (
        <div>
          <div>
            <ReCAPTCHA
              sitekey="j"
              //onChange={handleVerify}
              ref={captchaRef}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  }
  
};


/*
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <main>
          <form action="?" method="POST">
            <div class="g-recaptcha" data-sitekey="your_site_key"></div>
            <input type="submit" value="Submit"></input>
          </form>
      </main>
    </div>
  );
}


import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Home() {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const captchaRef = useRef(null);

  const handleVerify = (token) => {
    if (token) {
      alert('CAPTCHA verified: ' + token);
      setShowCaptcha(false);
    }
  };

  return (
    <div style={styles.page}>
      <button style={styles.button} onClick={() => setShowCaptcha(true)}>
        Show CAPTCHA
      </button>

      {showCaptcha && (
        <div style={styles.overlay}>
          <div style={styles.captchaBox}>
            <ReCAPTCHA
              sitekey="YOUR_RECAPTCHA_SITE_KEY"
              onChange={handleVerify}
              ref={captchaRef}
            />
            <button style={styles.cancelButton} onClick={() => setShowCaptcha(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  captchaBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    textAlign: 'center',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)',
  },
  cancelButton: {
    marginTop: 20,
    padding: '8px 16px',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  }
};

*/