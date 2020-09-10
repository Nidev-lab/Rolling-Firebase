import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { auth } from "../firebase";
// import { functions } from '../firebase';
import Alert from '../components/Alert/Alert';
import './login.css';

const Login = (props) => {
  const [registerClass, setRegisterClass] = useState('register');
  const [loginClass, setLoginClass] = useState('login');
  const [errorMsg, setErrorMsg] = useState("");
  const [errorMsgReg, setErrorMsgReg] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSucces, setIsSucces] = useState(false);
  const [isVisibleRegister, setIsVisibleRegister] = useState(false);
  const [isVisibleLogin, setIsVisibleLogin] = useState(false);
  const [isErrorReg, setIsErrorReg] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmpassword: ""
  });
  const [login, setLogin] = useState({
    loginemail: "",
    loginpassword: ""
  });

  const handleChange = e => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  }


  const handleReg = async (e) => {

    if (!data.email || !data.password || !data.confirmpassword) {
      setIsSucces(false)
      setIsVisibleRegister(true);
      setErrorMsgReg("It is necessary to complete all the fields.");
      setIsErrorReg(true);
      return
    }

    if (data.confirmpassword !== data.password) {
      setIsSucces(false);
      setIsVisibleRegister(true);
      setErrorMsgReg("Passwords do not match.");
      setIsErrorReg(true);
      return;
    }

    try {
      const resp = await auth.createUserWithEmailAndPassword(data.email, data.password);
      if (resp) {
        setIsSucces(true);
        // addAdmin();
        await auth.signOut();
        setErrorMsg('You registered successfully, you can now log in.')
        setIsError(false);
        setIsVisibleRegister(false);
        setData({
          email: "",
          password: "",
          confirmpassword: ""
        });
        setLoginClass('login traslationLogin');
        setRegisterClass('register hiddenRegister');
        setShowSignUp(true);
        setIsVisibleLogin(true);
        setLogin({
          loginemail: "",
          loginpassword: ""
        });

      }

    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setIsSucces(false);
        setIsVisibleRegister(true);
        setErrorMsgReg("The email address is already in use by another account.");
        setIsErrorReg(true);
      }
      if (error.code === "auth/invalid-email") {
        setIsSucces(false);
        setIsVisibleRegister(true);
        setErrorMsgReg("The email format is not correct.");
        setIsErrorReg(true);
      }
      if (error.code === "auth/invalid-password") {
        setIsSucces(false);
        setIsVisibleRegister(true);
        setErrorMsgReg("Invalid password.");
        setIsErrorReg(true);
      }
      if (error.code === "auth/weak-password") {
        setIsSucces(false);
        setIsVisibleRegister(true);
        setErrorMsgReg("Password should be at least 6 characters.");
        setIsErrorReg(true);
      }

    }
  }

  const handleClick = async (e) => {
    try {
      const resplogin = await auth.signInWithEmailAndPassword(login.loginemail.trim(), login.loginpassword.trim())
      setLogin({
        loginemail: "",
        loginpassword: ""
      })

      if (resplogin) {
        props.history.push("/admin-dashboard")
      }

    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setIsVisibleLogin(true)
        setIsSucces(false);
        setErrorMsg("The password is invalid or the user does not have a password.");
        setIsError(true);
      }
      if (error.code === "auth/invalid-password") {
        setIsVisibleLogin(true)
        setIsSucces(false);
        setErrorMsg("Invalid password.");
        setIsError(true);
      }
      if (error.code === "auth/user-not-found") {
        setIsVisibleLogin(true)
        setIsSucces(false);
        setErrorMsg("Invalid user.");
        setIsError(true);
      }
      if (error.code === "auth/user-not-found") {
        setIsVisibleLogin(true)
        setIsSucces(false);
        setErrorMsg("Invalid user.");
        setIsError(true);
      }
      if (error.code === "auth/invalid-email") {
        setIsVisibleLogin(true)
        setIsSucces(false);
        setErrorMsg("Invalid user.");
        setIsError(true);
      }

    }
    setLogin({
      loginemail: "",
      loginpassword: ""
    });
  }


  // const addAdmin = () => {

  //   const addRole = functions.httpsCallable('addAdmin');
  //   addRole({ email: data.email })
  //     .then(res => {
  //       console.log(res)
  //     }).catch(err => {
  //       console.log(err)
  //     })

  // }

  const handleShowSignUp = () => {

    setLoginClass('login traslationLoginReverse');
    setRegisterClass('register showRegister');
    setShowSignUp(false);
    setLogin({
      loginemail: "",
      loginpassword: ""
    });
    setIsVisibleLogin(false);
  }


  return (
    <div className="containerlogin">
      <div className="d-flex justify-content-center">
        <div className="logo"></div>
      </div>
      <div className="d-flex justify-content-around colorcont">
        <div className={registerClass}>
          <h4 className="text-white mb-4">Sign Up</h4>
          <form>
            <div class="form-group">
              <label for="exampleInputEmail1">Email</label>
              <input type="email" value={data.email} class="form-control" autoComplete="off" onChange={handleChange} name="email" id="email" aria-describedby="emailHelp" />
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input type="password" value={data.password} class="form-control" autoComplete="off" onChange={handleChange} name="password" id="password" />
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Confirm password</label>
              <input type="password" value={data.confirmpassword} class="form-control" autoComplete="off" onChange={handleChange} name="confirmpassword" id="confirmpassword" />
            </div>
            {isSucces ? '' : <Alert isVisible={isVisibleRegister} isError={isErrorReg} errorMsg={errorMsgReg} />}
            <button type="button" class="mt-4 btn btn-outline-light btn-block" onClick={handleReg}>Create</button>
          </form>
        </div>
        <div className="barra"></div>
        <div className={loginClass}>
          <h4 className="text-white mb-4">Login</h4>
          <form>
            <div class="form-group">
              <label for="exampleInputEmail1">Email</label>
              <input type="email" class="form-control" value={login.loginemail} name="loginemail" id="loginemail" onChange={handleChange} aria-describedby="emailHelp" />
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input type="password" class="form-control" value={login.loginpassword} name="loginpassword" onChange={handleChange} id="loginpassword" />
            </div>
            <div>
              <a href="" className="text-decoration-none"><p className="tamanorememberpass">¿Olvidaste tu contraseña?</p></a>
            </div>
            {<Alert isVisible={isVisibleLogin} isError={isError} errorMsg={errorMsg} />}
            <button type="button" onClick={handleClick} class="mt-4 btn btn-outline-light btn-block">Login</button>
            {
              showSignUp ? <button type="button" onClick={handleShowSignUp} class="mt-3 btn btn-outline-light btn-block">Sign Up</button> : ''
            }

          </form>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);