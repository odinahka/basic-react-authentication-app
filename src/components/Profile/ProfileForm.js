import { useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const {token} = authCtx
  const passwordInputRef = useRef();
  const submitHandler = (event) => {
    event.preventDefault();
    const enteredPassword = passwordInputRef.current.value;

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDh7y-yK0Em2l_LapTPXAUWBwL4uGGlEE', {
      method: 'POST',
      body: JSON.stringify({
        idToken: token, 
        password: enteredPassword,
        returnSecureToken: false
      }),
      headers: {
        'Context-Type':'application/json'
      }
    }).then(res => {
      history.replace('/')
    });
  }
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input ref={passwordInputRef} minLength="7" type='password' id='new-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
