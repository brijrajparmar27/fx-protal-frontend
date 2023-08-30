const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy('/fx-auth-server', {
      target: 'http://localhost:80',
      changeOrigin: true,
    })
  );
  app.use(
    proxy('/fx-crm', {
      target: 'http://localhost:80',
      changeOrigin: true,
    })
  );
  app.use(
    proxy('/cms', {
      target: 'http://localhost:80',
      changeOrigin: true,
    })
  );
  app.use(
    proxy('/fx-forrex', {
      target: 'http://localhost:80',
      changeOrigin: true,
    })
  );
  app.use(
    proxy('/fx-kyc', {
      target: 'http://localhost:80',
      changeOrigin: true,
    })
  );
  app.use(
    proxy('/app', {
      target: 'http://localhost:80',
      changeOrigin: true,
    })
  );
};
