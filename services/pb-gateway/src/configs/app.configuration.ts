import * as process from 'node:process';

export default (): object => ({
  pbGateway: {
    port: 3000,
    host: process.env.GATEWAY_HOST,
    url: process.env.GATEWAY_URL,
    allowedOrigins: process.env.ALLOWED_ORIGINS,
  },
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
  fbCollector: {
    port: parseInt(process.env.FB_COLLECTOR_PORT!, 10),
    host: process.env.FB_COLLECTOR_HOST,
    url: process.env.FB_COLLECTOR_URL,
  },
});
