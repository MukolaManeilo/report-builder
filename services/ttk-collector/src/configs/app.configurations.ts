import * as process from 'node:process';

export default (): object => ({
  nats: {
    port: parseInt(process.env.NATS_PORT!, 10),
    host: process.env.NATS_HOST,
    url: process.env.NATS_URL,
  },
  ttkCollector: {
    port: parseInt(process.env.TTK_COLLECTOR_PORT!, 10),
    host: process.env.TTK_COLLECTOR_HOST,
    url: process.env.TTK_COLLECTOR_URL,
  },
  dbGateway: {
    port: parseInt(process.env.DB_GATEWAY_PORT!, 10),
    host: process.env.DB_GATEWAY_HOST,
    url: process.env.DB_GATEWAY_URL,
  },
});
