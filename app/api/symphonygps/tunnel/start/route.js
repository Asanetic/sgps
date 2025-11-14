import { startTCPListener, stopTCPListener } from '../tunnel';

if (!global.tcpLogs) global.tcpLogs = [];
let initialized = false;

export async function GET() {
  // Start TCP listener
  if (!initialized) {
    startTCPListener({
      port: 9000,
      onData: (msg) => {
        global.tcpLogs.push(msg);
        if (global.tcpLogs.length > 100) global.tcpLogs.shift(); // keep last 100 messages
      },
    });
    initialized = true;
  }

  return new Response(JSON.stringify({ status: 'TCP listener active' }), { status: 200 });
}

export async function DELETE() {
  // Stop TCP listener
  stopTCPListener();
  initialized = false;
  return new Response(JSON.stringify({ status: 'TCP listener stopped' }), { status: 200 });
}
