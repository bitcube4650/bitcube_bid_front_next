import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/css/common.css';
import '../src/fontawesome-pro-6.1.1-web/css/all.min.css';
import { BidProvider } from '../src/modules/bid/context/BidContext';
import ErrorBoundary from '../src/ErrorBoundary';
import Loading from '../src/components/Loading';
import Layout from '../src/components/layout/Layout';

function MyApp({ Component, pageProps }) {
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      const requestInterceptor = axios.interceptors.request.use((config) => {
        setLoading(true);
        return config;
      });
  
      const responseInterceptor = axios.interceptors.response.use(
        (response) => {
          setLoading(false);
          return response;
        },
        (error) => {
          setLoading(false);
          return Promise.reject(error);
        }
      );
  
      return () => {
        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);
      };
    }, []);
  
    return (
      <BidProvider>
        <Loading loading={loading} />
        <ErrorBoundary>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ErrorBoundary>
      </BidProvider>
    );
  }
  
  export default MyApp;