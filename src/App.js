import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Login from './views/Login';
import Main from './views/Main';
import SignUp from './views/SignUp';
import Notice from './modules/notice/views/Notice';
import NoticeDetail from './modules/notice/views/NoticeDetail';
import NoticeEdit from './modules/notice/views/NoticeEdit';
import NotFound from './views/NotFound';
import Layout from './components/layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/common.css';
import './fontawesome-pro-6.1.1-web/css/all.min.css';
import CustList from './modules/cust/view/CustList';
import CustDetail from './modules/cust/view/CustDetail';
import SaveCust from './modules/cust/view/SaveCust';
import Item from './modules/info/views/Item';
import GroupUser from './modules/info/views/GroupUser'
import BidStatus from './modules/bid/views/BidStatus';
import BidStatusDetail from './modules/bid/views/BidStatusDetail';
import Rebid from './modules/bid/views/Rebid';

const App = () => {
	return (
		<div className='Router'>
			<BrowserRouter>
				<ScrollToTop />
				<Routes>
          			<Route path="/login" element={<Login />}></Route>
					<Route path="/" element={<Login />}></Route>
					<Route path="/signUp" element={<SignUp />}></Route>
					<Route element={<Layout />}>
						<Route path="/main" element={<Main />}></Route>
						<Route path="/bid/status" element={<BidStatus />}></Route>
						<Route path="/bid/status/detail" element={<BidStatusDetail />}></Route>
						<Route path="/bid/rebid" element={<Rebid />}></Route>
						<Route path="/notice" element={<Notice />}></Route>
						<Route path="/noticeDetail/:bno" element={<NoticeDetail />}></Route>
						<Route path="/noticeEdit" element={<NoticeEdit />}></Route>
						<Route path="/noticeEdit/:bno" element={<NoticeEdit />}></Route>
						<Route path="/company/partner/approval" element={<CustList />}></Route>
						<Route path="/company/partner/management" element={<CustList />}></Route>
						<Route path="/company/partner/approval/:custCode" element={<CustDetail />}></Route>
						<Route path="/company/partner/management/:custCode" element={<CustDetail />}></Route>
						<Route path="/company/partner/management/save" element={<SaveCust />}></Route>
						<Route path="/company/partner/management/save/:custCode" element={<SaveCust />}></Route>
						<Route path="/info/group/item" element={<Item />}></Route>
						<Route path="/info/group/user" element={<GroupUser />}></Route>
					</Route>
					{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
					<Route path="*" element={<NotFound />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;