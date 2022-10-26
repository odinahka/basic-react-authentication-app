
import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    let url;
    setIsLoading(true);
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDh7y-yK0Em2l_LapTPXAUWBwL4uGGlEEI";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDh7y-yK0Em2l_LapTPXAUWBwL4uGGlEEI";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      setIsLoading(false);
      if (res.ok) {
        return res.json()
      } else {
        return res.json().then((data) => {
          //Error modal
          let errorMessage = "Authentication Failed!";
          if (data && data.error && data.error.message) {
            errorMessage = data.error.message;
          }
          throw new Error(errorMessage);
        });
      }
    }).then(data => {
      const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));
      authCtx.login(data.idToken, expirationTime.toISOString());
      history.replace('/')
    }).catch(err => {
      alert(err);
    });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input ref={emailInputRef} type="email" id="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            ref={passwordInputRef}
            type="password"
            id="password"
            required
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button type="submit">
              {isLogin ? "Login" : "Create Account"}
            </button>
          )}
          {isLoading && <p>Sending Request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
