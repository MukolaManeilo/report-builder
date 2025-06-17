import * as process from 'node:process';

export default (): object => ({
  gateway: {
    port: parseInt(process.env.GATEWAY_PORT!, 10),
    ip: process.env.GATEWAY_IP,
    url: process.env.GATEWAY_URL,
    allowedOrigins: process.env.ALLOWED_ORIGINS,
  },
  nats: {
    port: parseInt(process.env.NATS_PORT!, 10),
    ip: process.env.NATS_IP,
    url: process.env.NATS_URL,
  },
  ttkCollector: {
    port: parseInt(process.env.TTK_COLLECTOR_PORT!, 10),
    ip: process.env.TTK_COLLECTOR_IP,
    url: process.env.TTK_COLLECTOR_URL,
  },
  fbCollector: {
    port: parseInt(process.env.FB_COLLECTOR_PORT!, 10),
    ip: process.env.FB_COLLECTOR_IP,
    url: process.env.FB_COLLECTOR_URL,
  },
});
