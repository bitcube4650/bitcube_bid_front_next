import React from 'react';
import LoginWrap from '../components/LoginWrap';
import LoginFooter from '../components/LoginFooter';

const Login = () => {
    const logoUrl = "../../images/bitcube_logo_black.png";

    return (
        <div>
            <div className="loginBg">
                <div className="inner">
                    <LoginWrap logoUrl={logoUrl}/>
                    <LoginFooter />
                </div>
            </div>
        </div>
        
    );
};

export default Login;