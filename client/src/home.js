import React from "react";

const Home = () => {
  const goToLogin = () => {
    window.location.href = "/login-page";
  };
  const goToRegister = () => {
    window.location.href = "/signup";
  };
  return (
    <div>
      <div>
        Signup
        <button onClick={goToLogin}>Go to Signup</button>
      </div>
      <div>
        Signin
        <button onClick={goToRegister}>Go to Login</button>
      </div>
    </div>
  );
};

export default Home;
