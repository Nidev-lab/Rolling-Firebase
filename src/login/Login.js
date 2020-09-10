import React, {useState} from 'react';
import { withRouter } from 'react-router-dom';
import {auth} from "../firebase";
import cerrar from '../image/cerrar.png';
import './login.css';

const Login = (props) => { 

    const [regpass, setRegPass] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [errorMsgReg, setErrorMsgReg] = useState("")
    const [isError, setIsError] = useState(false)    
    const [isErrorDanger, setIsErrorDanger] = useState(false)
    const [isErrorSuccess, setIsErrorSuccess] = useState(false)
    const [isErrorReg, setIsErrorReg] = useState(false)
    const [data, setData] = useState({
        email : "",
        password : ""
    })
    const [login, setLogin] = useState({
        loginemail : "",
        loginpassword : ""
    })

    const handleChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        })
        setLogin({
            ...login,
            [e.target.name]: e.target.value,
        })
        setRegPass({
            [e.target.name]: e.target.value,
        })
        console.log(regpass)
    }

    const handleReg = async (e) => {
        if(data.confirmpassword !== data.password){
            setErrorMsgReg("Las contraseñas no coinciden.");
            setIsErrorReg(true);
            return;
        }
        try {
            const resp = await auth.createUserWithEmailAndPassword(data.email, data.password);
            console.log( resp );
        } catch (error) {
            if(error.code === "auth/email-already-in-use"){
                setErrorMsgReg("The email address is already in use by another account.");
                setIsErrorReg(true);
            }
            if(error.code === "auth/invalid-password"){
                setErrorMsgReg("Debe ser una string con al menos seis caracteres.");
                setIsErrorReg(true);
            }
            if(error.code === "auth/weak-password"){
                setErrorMsgReg("Password should be at least 6 characters");
                setIsErrorReg(true);
            }
            console.log(error)
        }
    }

    const handleClick = async (e) => {
        try {
            const resplogin = await auth.signInWithEmailAndPassword(login.loginemail, login.loginpassword)
            console.log(resplogin)
            setLogin({
                loginemail : "" ,
                loginpassword : ""
            })
            props.history.push("/admin-dashboard")
        } catch (error) {
            if(error.code === "auth/wrong-password"){
                setErrorMsg("The password is invalid or the user does not have a password.");
                setIsError(true);
            }
            if(error.code === "auth/invalid-password"){
                setErrorMsg("Invalid password.");                
                setIsError(true);
            }
            if(error.code === "auth/user-not-found"){
                setErrorMsg("Invalid user.");                
                setIsError(true);
            }
            console.log(error)
        }
        setLogin({
            loginemail : "" ,
            loginpassword : ""
        })
    }

    const handleRegPass = async (e) => {
        try {
            const respregpass = await auth.sendPasswordResetEmail(regpass.regpass)
            if(respregpass === undefined){             
                setIsErrorSuccess(true);
                setIsErrorDanger(false);
            }
            setRegPass( regpass === "" )
            console.log(regpass)
            console.log(respregpass)
        } catch (error) {
            if(error.code === "auth/user-not-found"){
                setErrorMsg("There is no user record corresponding to this identifier.");                
                setIsErrorDanger(true);
                setIsErrorSuccess(false);
            }
            console.log(error)
        }
    }

    
    return (
        <div className="containerlogin">
            <div className="d-flex justify-content-center">
                <div className="logo"></div>
            </div>
            <div className="d-flex justify-content-around colorcont">
                <div className="register">
                    <h4 className="text-white mb-4">Sign Up</h4>
                    <form>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Email</label>
                            <input type="email" class="form-control" onChange={handleChange} name="email" id="email" aria-describedby="emailHelp"/>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" class="form-control" onChange={handleChange} name="password" id="password"/>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Confirm password</label>
                            <input type="password" class="form-control" onChange={handleChange} name="confirmpassword" id="confirmpassword"/>
                        </div>
                        {isErrorReg ? <p className="text-danger fontmsg">{errorMsgReg}</p> : "" }
                        <button type="button" class="mt-4 btn btn-outline-light btn-block" onClick={handleReg}>Create</button>
                    </form>
                </div>
                <div className="barra"></div>
                <div className="login">
                    <h4 className="text-white mb-4">Sign In</h4>
                    <form>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Email</label>
                            <input type="email" class="form-control" name="loginemail" id="loginemail" onChange={handleChange} aria-describedby="emailHelp"/>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" class="form-control" name="loginpassword" onChange={handleChange} id="loginpassword"/>
                        </div>
                        <div>
                            <a href="" className="text-decoration-none" data-toggle="modal" data-target="#exampleModal"><p className="tamanorememberpass">¿Olvidaste tu contraseña?</p></a>
                        </div>
                        {isError ? <p className="text-danger fontmsg">{errorMsg}</p> : "" }
                        <button type="button" onClick={handleClick} class="mt-4 btn btn-outline-light btn-block">Sign In</button>
                    </form>
                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="" data-dismiss="modal">
                            <img src={cerrar} alt="" className="cerraricon"/>
                        </div>
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <h6>Enter your email to regenerate your password.</h6>
                                    <form>
                                        <div class="form-group mt-4">
                                            <label for="exampleInputEmail1">Email</label>
                                            <input value={regpass.regpass} type="email" class="form-control" name="regpass" id="regpass" onChange={handleChange} aria-describedby="emailHelp"/>
                                        </div>
                                        {isErrorDanger ? <p className="text-danger fontmsg">{errorMsg}</p> : "" }
                                        {isErrorSuccess ? <p className="text-success fontmsg">We send you an email so you can choose your new password</p> : "" }
                                        <button type="button" onClick={handleRegPass} class="mt-4 btn btn-outline-light btn-block">Enviar</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter (Login);