import React from 'react';
import { Outlet, useLocation, Route, Routes } from 'react-router-dom';

import Menu from './Menu'
import Header from './Header'
import Footer from './Footer'
import Main from '../../modules/main/views/Main';
import PartnerMain from '../../modules/main/views/PartnerMain';

const Layout = () => {
    const location = useLocation();
    const loginInfoString = localStorage.getItem("loginInfo"); 
    const loginInfo = loginInfoString ? JSON.parse(loginInfoString) : null;

    if(loginInfo == null) {
        if(location.pathname === '/') {
            return (
                <div id="wrap">
                       <Outlet />
                </div>
            );
        } else {
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
                                    <Main />
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