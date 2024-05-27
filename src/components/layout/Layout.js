import React from 'react';
import { Outlet } from 'react-router-dom';

import Menu from './Menu'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
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
};

export default Layout;