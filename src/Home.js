import "./styles.css"
import {useEffect, useState} from "react";
import axios from "axios";
import {googleLogout, useGoogleLogin} from "@react-oauth/google";
import logo from "./pictures/peekabooClean.png"
import Container from "react-bootstrap/Container"
import {Col, Row} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () =>{
    const [ user, setUser ] = useState(null);
    const [ profile, setProfile ] = useState(null);
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse);
            navigate('/datapage');
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile(null);
    };
    return(
        <>
            <br/>
            <h1 className="l_title">Privacy Peekaboo</h1>
            <div className="loginContainer">
                <Container fluid>
                    <Row>
                        <img src={logo} alt="ghost" className="siteLogo" style={{display: "block", margin: "auto"}} />
                    </Row>
                    <Row style={{textAlign:'center'}}>
                        <h1 style={{color: "white"}}>Log In With Google to Analyze Your Web Traffic</h1>
                    </Row>
                    <Row>
                        <div>
                            <br/>
                            <br/>
                            {profile ? (
                                <div>
                                    <img src={profile.picture} alt="user profile"/>
                                    <h3>User Logged in</h3>
                                    <p>Name: {profile.name}</p>
                                    <p>Email Address: {profile.email}</p>
                                    <br/>
                                    <br/>
                                    <button className="logoutButton" onClick={logOut}>Log out</button>
                                </div>
                            ) : (
                                <button className="loginButton" onClick={() => login()} style={{
                                    display: "block", margin: "auto", fontSize: "20px"
                                }} >Sign in with Google </button>
                            )}
                        </div>
                    </Row>

                </Container>
            </div>


        </>
    )


};

export default Home;
