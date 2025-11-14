import { parseGPSData } from "../tunnelUtils";

// Use the same global log array as TCP listener
if (!global.tcpLogs) global.tcpLogs = [];

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message) return new Response(JSON.stringify({ error: 'No message provided' }), { status: 400 });

    // Store in the global TCP logs
    global.tcpLogs.push(`FE: ${message}`);
    if (global.tcpLogs.length > 100) global.tcpLogs.shift();

    console.log('FE message received:', message);

    const parsedMessage = parseGPSData(message)

    return new Response(JSON.stringify({ status: 'success', parsedMessage }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ logs: global.tcpLogs || [] }), { status: 200 });
}
