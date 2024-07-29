import React from 'react';
import LoginWrap from '../src/modules/login/components/LoginWrap.tsx';
import LoginFooter from '../src/modules/login/components/LoginFooter';

const Index: React.FC = () => {
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

export default Index;