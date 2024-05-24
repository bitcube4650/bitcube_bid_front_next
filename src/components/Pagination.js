import React from 'react';

const Pagination = ({ onSearch, list }) => {
	const curr = Math.floor((list.number) / 5);
	const lastGorup = Math.floor(list.totalPages / 5);
	const pageMap = onPageMap();

	function onPageMap() {
		var rtnList = [];
		if(list.totalPages-list.number >= 5) {
			return [1, 2, 3, 4, 5];
		} else {
			for(var i = 1; i <= list.totalPages%5; i++) {
				rtnList.push(i);
			}
		}

		return rtnList;
	}

    return (
        <div className="pagination1 text-center">
			<a href="#" onClick={() => onSearch(curr==0?list.number:(curr-1)*5)} title="이전 페이지그룹 이동">
				<i className="fa-light fa-chevrons-left"></i>
			</a>
			<a href="#" onClick={() => {onSearch(list.number==0?0:(list.number-1));}} title="이전 페이지로 이동">
				<i className="fa-light fa-chevron-left"></i>
			</a>
			
			{ list.empty && <a href="#" onClick={() => {onSearch(0);}} title="1페이지로 이동" class="number active" >1</a> }

			{list.empty == false && pageMap.map((idx) => (
				<a href="#" onClick={() => {onSearch(curr*5+idx-1);}} title={idx + "페이지로 이동"}
					className={list.number+1 == curr*5+idx ? 'number active':'number'} v-for="idx in 5">{ curr*5+idx }
				</a>
			))}
			
			
			<a href="#" onClick={() => {onSearch(list.number==list.totalPages-1?list.number:list.number+1);}} title="다음 페이지로 이동">
				<i className="fa-light fa-chevron-right"></i>
			</a>
			<a href="#" onClick={() => {onSearch(curr==lastGorup?list.number:(curr+1)*5);}} title="끝페이지 다음 페이지로 이동">
				<i className="fa-light fa-chevrons-right"></i>
			</a>
		</div>
    );
};

export default Pagination;