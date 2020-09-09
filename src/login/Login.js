import React, {useState} from 'react';
import { withRouter } from 'react-router-dom';
import {auth} from "../firebase";
import './login.css';

const Login = (props) => { 

    const [isError, setIsError] = useState(false)
    const [data, setData] = useState({})
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
    }

    const handleReg = (e) => {
        if(data.confirmpassword !== data.password){
            alert("fail bro")
            return;
        }
        try {
            const resp = auth.createUserWithEmailAndPassword(data.email, data.password)
            console.log(resp)
        } catch (error) {
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
            if(error.code == "auth/wrong-password"){
                alert("The password is invalid or the user does not have a password.")
                setIsError(true);
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
                    {isError ? <p>Holis</p> : "" }
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
                            <a href="" className="text-decoration-none"><p className="tamanorememberpass">¿Olvidaste tu contraseña?</p></a>
                        </div>
                        <button type="button" onClick={handleClick} class="mt-4 btn btn-outline-light btn-block">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default withRouter (Login);