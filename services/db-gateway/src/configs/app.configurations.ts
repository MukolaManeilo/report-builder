import * as process from 'node:process';

export default (): object => ({
  dbGateway: {
    port: parseInt(process.env.DB_GATEWAY_PORT!, 10),
    host: process.env.DB_GATEWAY_HOST,
    url: process.env.DB_GATEWAY_URL,
  },
});
