import * as process from 'node:process';

export default (): object => ({
  dbGateway: {
    port: 3000,
    host: process.env.DB_GATEWAY_HOST,
    url: process.env.DB_GATEWAY_URL,
  },
});
