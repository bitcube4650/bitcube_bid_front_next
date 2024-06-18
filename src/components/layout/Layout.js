import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import Menu from './Menu'
import Header from './Header'
import Footer from './Footer'
import Main from '../../modules/main/views/Main';
import Login from '../../modules/login/views/Login';
import PartnerMain from '../../modules/main/views/PartnerMain';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const loginInfoString = localStorage.getItem("loginInfo"); 
    const loginInfo = loginInfoString ? JSON.parse(loginInfoString) : null;

    useEffect(() => {
        const publicPaths = ['/', '/SignUp', '/SignUpMain'];
        if (loginInfo == null && !publicPaths.includes(location.pathname)) {
            navigate('/');
        } else if (loginInfo != null && (location.pathname === '/SignUp' || location.pathname === '/SignUpMain')) {
            navigate('/');
        }
    }, [location, navigate, loginInfo]);

    if(loginInfo == null) {
        if(location.pathname === '/') {
            return (
                <div id="wrap">
                    <Outlet />
                </div>
            );
        } else if (location.pathname === '/SignUp' || location.pathname === '/SignUpMain') {
            return (
                <div id="wrap">
                    <Header />
                    <Outlet />
                </div>
            );
        }
    } else {
        if(location.pathname === '/') {
            if(loginInfo.custType === 'inter') {
                return (
                    <div id="wrap">
                            <Header />
                            <div className="contentWrap">
                                <Menu />
                                <div className="conRightWrap">
                                    <Main />
                                    <Footer />
                                </div>
                            </div>
                    </div>
                );
            } else {
                return (
                    <div id="wrap">
                            <Header />
                            <div className="contentWrap">
                                <Menu />
                                <div className="conRightWrap">
                                    <PartnerMain />
                                    <Footer />
                                </div>
                            </div>
                    </div>
                );
            }
        } else {
            return (
                <div id="wrap">
                        <Header />
                        <div className="contentWrap">
                            <Menu />
                            <div className="conRightWrap">
                                <Outlet />
                                <Footer />
                            </div>
                        </div>
                </div>
            );
        }
    } 
};

export default Layout;