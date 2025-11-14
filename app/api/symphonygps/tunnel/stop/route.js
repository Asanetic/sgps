import { stopTCPListener } from '../tunnel';

let initialized = false;

export async function DELETE() {
  if (!initialized) return new Response(JSON.stringify({ status: 'TCP not running' }), { status: 200 });

  const result = await stopTCPListener();
  initialized = false;

  return new Response(JSON.stringify(result), { status: 200 });
}
