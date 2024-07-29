
module.exports = {
  eslint: {
      ignoreDuringBuilds: true,
  },
    async rewrites() {
      return [
        {
          source: '/:path*',  
          destination: 'http://localhost:18500/:path*',  
        },
      ];
    },
  };