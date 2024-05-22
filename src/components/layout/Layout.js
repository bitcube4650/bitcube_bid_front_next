import React from 'react';
import { Outlet } from 'react-router-dom';

import Menu from './Menu'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
    return (
        <div id="wrap">
                <Header />
                <div class="contentWrap">
                    <Menu />
                    <div class="conRightWrap">
                        <Outlet />
                        <Footer />
                    </div>
                </div>
        </div>
    );
};

export default Layout;