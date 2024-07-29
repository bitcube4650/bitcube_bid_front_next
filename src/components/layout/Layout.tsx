import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import Menu from './Menu';
import Main from '../../modules/main/views/Main';
import PartnerMain from '../../modules/main/views/PartnerMain';

interface LayoutProps {
  children: ReactNode;
}

interface Notice {
  bno: number;
}

interface NoticeResponse {
  content: Notice[];
}

interface BidInfo {
  planning: string;
  noticing: string;
  beforeOpening: string;
  opening: string;
  completed: string;
  unsuccessful: string;
}

interface PartnerInfo {
  request: string;
  approval: string;
  deletion: string;
}

interface MainProps {
  noticeListData: NoticeResponse;
  bidInfoData: BidInfo;
  partnerCntData: PartnerInfo;
  //pwInitData: boolean;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { pathname } = router;

  const loginInfoString = typeof window !== 'undefined' ? localStorage.getItem('loginInfo') : null;
  const loginInfo = loginInfoString ? JSON.parse(loginInfoString) : null;

  useEffect(() => {
    const publicPaths = ['/', '/signUp', '/signUp/signUpMain'];
    if (loginInfo == null && !publicPaths.includes(pathname)) {
      router.push('/');
    } else if (loginInfo != null && (pathname === '/signUp' || pathname === '/signUp/signUpMain')) {
      router.push('/');
    }
  }, [pathname, loginInfo, router]);

  const [mainProps, setMainProps] = useState<MainProps>({
    noticeListData: { content: [] },
    bidInfoData: {
      planning: "0",
      noticing: "0",
      beforeOpening: "0",
      opening: "0",
      completed: "0",
      unsuccessful: "0",
    },
    partnerCntData: {
      request: "0",
      approval: "0",
      deletion: "0",
    },
    //pwInitData: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const noticeListData = await selectNotice();
      const bidInfoData = await selectBidCnt();
      const partnerCntData = await selectPartnerCnt();
      //const pwInitData = await fnChkPwChangeEncourage();

      setMainProps({ noticeListData, bidInfoData, partnerCntData });
    };

    fetchData();
  }, []);

  const selectNotice = async () => {
    try {
      const response = await axios.post('/api/v1/notice/noticeList', { size: 7, page: 0 });
      if (response.data.code === 'OK') {
        return response.data.data;
      } else {
        console.log(response.data.msg);
        return { content: [] };
      }
    } catch (error) {
      console.error(error);
      return { content: [] };
    }
  };

  const selectBidCnt = async () => {
    try {
      const response = await axios.post('/api/v1/main/selectBidCnt', {});
      if (response.data.code === 'OK') {
        return response.data.data;
      } else {
        console.log(response.data.msg);
        return {
          planning: "0",
          noticing: "0",
          beforeOpening: "0",
          opening: "0",
          completed: "0",
          unsuccessful: "0",
        };
      }
    } catch (error) {
      console.error(error);
      return {
        planning: "0",
        noticing: "0",
        beforeOpening: "0",
        opening: "0",
        completed: "0",
        unsuccessful: "0",
      };
    }
  };

  const selectPartnerCnt = async () => {
    try {
      const response = await axios.post('/api/v1/main/selectPartnerCnt', {});
      if (response.data.code === 'OK') {
        return response.data.data;
      } else {
        console.log(response.data.msg);
        return {
          request: "0",
          approval: "0",
          deletion: "0",
        };
      }
    } catch (error) {
      console.error(error);
      return {
        request: "0",
        approval: "0",
        deletion: "0",
      };
    }
  };

  const fnChkPwChangeEncourage = async () => {
    const loginInfoString = localStorage.getItem('loginInfo');
    const loginInfo = loginInfoString ? JSON.parse(loginInfoString) : null;
    if (loginInfo) {
      const params = {
        userId: loginInfo.userId,
        isGroup: true,
      };
      try {
        const response = await axios.post('/api/v1/main/chkPwChangeEncourage', params);
        if (response.data.code === 'OK') {
          return response.data.data;
        } else {
          console.log(response.data.msg);
          return false;
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    return false;
  };

  if (loginInfo == null) {
    if (pathname === '/') {
      return (
        <div id="wrap">
          {children}
        </div>
      );
    } else if (pathname === '/signUp' || pathname === '/signUp/signUpMain') {
      return (
        <div id="wrap">
          <Header />
          {children}
        </div>
      );
    }
  } else {
    if (pathname === '/') {
      if (loginInfo.custType === 'inter') {
        return (
          <div id="wrap">
            <Header />
            <div className="contentWrap">
              <Menu />
              <div className="conRightWrap">
                <Main {...mainProps} />
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
              {children}
              <Footer />
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
};

export default Layout;