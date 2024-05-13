import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './views/Login';
import Bid from './views/Bid';
import NotFound from './views/NotFound';
import './css/common.css';

const App = () => {
	return (
		<div className='App'>
			<BrowserRouter>
				<Routes>
          <Route path="/login" element={<Login />}></Route>
					<Route path="/" element={<Login />}></Route>
          <Route path="/bid/*" element={<Bid />}></Route>
					{/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
					<Route path="*" element={<NotFound />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;