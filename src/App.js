import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Login from './views/Login';
import Main from './views/Main';
import SignUp from './views/SignUp';
import SignUpMain from './views/SignUpMain';
import BidProgress from './modules/bid/views/BidProgress';
import BidProgressSave from './modules/bid/views/BidProgressSave';
import BidProgressDetail from './modules/bid/views/BidProgressDetail';
import BidStatus from './modules/bid/views/BidStatus';
import BidStatusDetail from './modules/bid/views/BidStatusDetail';
import Rebid from './modules/bid/views/Rebid';
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
import Company from './modules/statistics/views/Company';
import PerformanceDetail from './modules/statistics/views/PerformanceDetail';
import BiddingStatus from './modules/statistics/views/BiddingStatus';
import BiddingDetail from './modules/statistics/views/BiddingDetail';
import { BidProvider } from './modules/bid/context/BidContext';
import ErrorBoundary from './ErrorBoundary';
import PartnerBidStatus from './modules/bid/views/PartnerBidStatus'
import PartnerBidStatusDetail from './modules/bid/views/PartnerBidStatusDetail'
import BidComplete from './modules/bid/views/BidComplete'
import BidCompleteDetail from './modules/bid/views/BidCompleteDetail'
import PartnerBidComplete from './modules/bid/views/PartnerBidComplete'
import PartnerBidCompleteDetail from './modules/bid/views/PartnerBidCompleteDetail'
import BidHistory from './modules/bid/views/BidHistory'
import AdminFaq from './modules/notice/views/AdminFaq';
import UserFaq from './modules/notice/views/UserFaq';

const App = () => {
	return (
		<div className='Router'>
			<BrowserRouter>
				<ScrollToTop />
				<ErrorBoundary> {/*Context를 사용할 때 ErrorBoundary를 사용해야 어떤 에러가 나오는지 표시됩니다.*/}
					<BidProvider>
						<Routes>
							<Route path="/login" element={<Login />}></Route>
							<Route path="/" element={<Login />}></Route>
							<Route path="/signUp" element={<SignUp />}></Route>
							<Route path="/signUpMain" element={<SignUpMain />}></Route>
							<Route element={<Layout />}>
								<Route path="/main" element={<Main />}></Route>
								<Route path="/bid/progress" element={<BidProgress />}></Route>
								<Route path="/bid/progress/save" element={<BidProgressSave />}></Route>
								<Route path="/bid/progress/detail/:biNo" element={<BidProgressDetail />}></Route>
								<Route path="/bid/status" element={<BidStatus />}></Route>
								<Route path="/bid/status/detail" element={<BidStatusDetail />}></Route>
								<Route path="/bid/rebid" element={<Rebid />}></Route>
								<Route path="/notice" element={<Notice />}></Route>
								<Route path="/noticeDetail/:bno" element={<NoticeDetail />}></Route>
								<Route path="/noticeEdit" element={<NoticeEdit />}></Route>
								<Route path="/noticeEdit/:bno" element={<NoticeEdit />}></Route>
								<Route path="/notice/faq/admin" element={<AdminFaq />}></Route>
								<Route path="/notice/faq/user" element={<UserFaq />}></Route>
								<Route path="/company/partner/approval" element={<CustList />}></Route>
								<Route path="/company/partner/management" element={<CustList />}></Route>
								<Route path="/company/partner/approval/:custCode" element={<CustDetail />}></Route>
								<Route path="/company/partner/management/:custCode" element={<CustDetail />}></Route>
								<Route path="/company/partner/management/save" element={<SaveCust />}></Route>
								<Route path="/company/partner/management/save/:custCode" element={<SaveCust />}></Route>
								<Route path="/info/group/item" element={<Item />}></Route>
								<Route path="/info/group/user" element={<GroupUser />}></Route>
								<Route path="/statistics/performance/company" element={<Company />}></Route>
								<Route path="/statistics/performance/detail" element={<PerformanceDetail />}></Route>
								<Route path="/statistics/status" element={<BiddingStatus />}></Route>
								<Route path="/statistics/detail" element={<BiddingDetail />}></Route>
								<Route path="/bid/complete" element={<BidComplete />}></Route>
								<Route path="/bid/complete/detail" element={<BidCompleteDetail />}></Route>
								<Route path="/bid/partnerStatus" element={<PartnerBidStatus />}></Route>
								<Route path="/bid/partnerStatus/detail" element={<PartnerBidStatusDetail />}></Route>
								<Route path="/bid/partnerComplete" element={<PartnerBidComplete />}></Route>
								<Route path="/bid/partnerComplete/detail" element={<PartnerBidCompleteDetail />}></Route>
								<Route path="/bid/history" element={<BidHistory />}></Route>
							</Route>
							{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
							<Route path="*" element={<NotFound />}></Route>
						</Routes>
					</BidProvider>
				</ErrorBoundary>
			</BrowserRouter>
		</div>
	);
};

export default App;