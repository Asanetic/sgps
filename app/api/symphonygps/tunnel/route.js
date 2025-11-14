import { startTCPListener } from "./tunnel";

let initialized = false;

export async function GET() {
  if (!initialized) {
    startTCPListener({
      port: 9000,
      onData: (message, socket) => {
        // You can customize this logic
        console.log("Processing message:", message);

        // Optionally, reply to sender
        socket.write(`ACK ${message}\n`);
      },
    });

    initialized = true;
  }

  return Response.json({ status: "TCP listener active on port 9000" });
}
