module.exports = {
  apps: [
    {
      name: 'user-service',
      script: 'server.js',      // just the filename here
      cwd: './user-service',    // working directory where server.js lives
    },
    {
      name: 'appointment-service',
      script: 'server.js',
      cwd: './appointment-service',
    },
    {
      name: 'review-service',
      script: 'server.js',
      cwd: './review-service',
    },
    {
      name: 'doctor-service',
      script: 'server.js',
      cwd: './doctor-service',
    },
    {
      name: 'payment-service',
      script: 'server.js',
      cwd: './payment-service',
    },
  ],
};
