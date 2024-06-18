import React from 'react';
import { PageProps } from 'components/types'

const Pagination = (props: PageProps) => {
	const curr = Math.floor((props.list.number) / 5);
	const lastGorup = Math.floor(props.list.totalPages / 5)-1;
	const pageMap = onPageMap();

	function onPageMap() {
		let rtnList = [];

		if(props.list.number < Math.floor(props.list.totalPages/5)*5) {
			return [1, 2, 3, 4, 5];
		} else {
			for(let i = 1; i <= props.list.totalPages%5; i++) {
				rtnList.push(i);
			}
		}

		return rtnList;
	}

	function onPage(page: number) {
		props.setSrcData({
            ...props.srcData,
            ["page"]: page
        });
	}
	
	return (
		<div className="pagination1 text-center">
			<a href="#" onClick={ () => onPage(curr==0?props.list.number:(curr-1)*5) } title="이전 페이지그룹 이동">
				<i className="fa-light fa-chevrons-left"></i>
			</a>
			<a href="#" onClick={ () => { onPage(props.list.number==0?0:(props.list.number-1)); } } title="이전 페이지로 이동">
				<i className="fa-light fa-chevron-left"></i>
			</a>
			
			{ props.list.empty && <a href="#" onClick={ () => {onPage(0);} } title="1페이지로 이동" className="number active" >1</a> }

			{ props.list.empty == false && pageMap.map((idx) => (
				<a href="#" onClick={ () => { onPage(curr*5+idx-1); } } title={ idx + "페이지로 이동" } key={ idx }
					className={ props.list.number+1 == curr*5+idx ? 'number active':'number' }>{ curr*5+idx }
				</a>
			)) }
			
			
			<a href="#" onClick={ () => { onPage(props.list.number==props.list.totalPages-1?props.list.number:props.list.number+1); } } title="다음 페이지로 이동">
				<i className="fa-light fa-chevron-right"></i>
			</a>
			<a href="#" onClick={ () => { onPage(curr==lastGorup?props.list.totalPages-1:(curr+1)*5); } } title="끝페이지 다음 페이지로 이동">
				<i className="fa-light fa-chevrons-right"></i>
			</a>
		</div>
    );
};

export default Pagination;