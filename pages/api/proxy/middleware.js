import { createProxyMiddleware } from 'http-proxy-middleware';

module.exports = (app) => {
    app.use(
      "/",
      createProxyMiddleware({
        target: "http://localhost:18500",
        changeOrigin: true,
      })
    );
};