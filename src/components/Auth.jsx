import React, { useState } from "react";
import Login from "./login";
import Register from "./register";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-wrapper">
      {isLogin ? (
        <Login onToggleAuth={toggleAuth} />
      ) : (
        <Register onToggleAuth={toggleAuth} />
      )}
      <style jsx>{`
        .auth-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: var(--back-color);
        }
      `}</style>
    </div>
  );
};

export default Auth;
