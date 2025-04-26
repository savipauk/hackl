import React, { useState } from 'react';

import "@/styles/login.css";
import { appTitle } from '@/lib/globals';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "test" && password === "test") {
      console.log("Login is successful");
      window.location.href = "/admin";
    }
    else if (username === "gost" && password === "gost") {
      console.log("Login is successful");
      window.location.href = "/guest";
    }
    else {
      console.log("Login failed");
    }
    console.log('Prijava:', { username, password });
  };

  const handleCancel = () => {
    window.location.href = "/";
    setUsername('');
    setPassword('');
    console.log('Odustani kliknut');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="zagreb-img">
          <img id="profile" src="/zagreb.svg" alt="Profile" />
        </div>
        <h1>{appTitle}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Korisničko ime</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Lozinka</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="button-group">
            <button type="submit" className="submit-btn">Prijavi se</button>
            <a href="/">Odustani</a>
          </div>
        </form>
      </div>
    </div>
  );
};
