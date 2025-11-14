export async function GET() {
    return new Response(
      JSON.stringify({ logs: global.tcpLogs || [] }),
      { status: 200 }
    );
  }
  