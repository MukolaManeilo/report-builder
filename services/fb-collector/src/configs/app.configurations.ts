import * as process from 'node:process';

export default (): object => ({
  nats: {
    port: parseInt(process.env.NATS_PORT!, 10),
    host: process.env.NATS_HOST,
    url: process.env.NATS_URL,
  },
  fbCollector: {
    port: parseInt(process.env.FB_COLLECTOR_PORT!, 10),
    host: process.env.FB_COLLECTOR_HOST,
    url: process.env.FB_COLLECTOR_URL,
  },
  dbGateway: {
    port: parseInt(process.env.DB_GATEWAY_PORT!, 10),
    host: process.env.DB_GATEWAY_HOST,
    url: process.env.DB_GATEWAY_URL,
  },
});
