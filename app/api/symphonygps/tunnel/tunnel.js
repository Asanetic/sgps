import net from "net";
import {AddDevicegpslogs} from '../gpslogs/devicegpslogs/DevicegpslogsDbGateway';
import { magicRandomStr } from "../../apiUtils/dataControl/dataUtils";
import { computeUnknownCoordinates, logTcpAlarm, parseGPSData, processDevicePingToLog } from "./tunnelUtils";

let tcpServer = null;
let sockets = [];

export function startTCPListener({ port = 9000, onData }) 
{
  if (tcpServer) return tcpServer;

  tcpServer = net.createServer((socket) => {
    
    sockets.push(socket);    

    socket.on("data", async (data) => {

      const message = data.toString().trim();

      // insert data 
      const newId = magicRandomStr(10);
      const interpretedData = parseGPSData(message)
      const {insertObject, gpsRequest} = await processDevicePingToLog(interpretedData)
      
      insertObject.record_id = newId 
      insertObject.remark = `Sat`   
      insertObject.log_details = `${JSON.stringify(gpsRequest)} - ${message}`
      AddDevicegpslogs(newId, insertObject, {}, {})      
      logTcpAlarm(insertObject, gpsRequest, newId)

      if(gpsRequest.satellites == 0){
      //--- End ---//      
        computeUnknownCoordinates(interpretedData, newId)

      }

      if (typeof onData === "function") onData(message, socket);

    });

    socket.on("end", () => {
      sockets = sockets.filter((s) => s !== socket);
      console.log("TCP client disconnected.");
    });

    socket.on("error", (err) => {
      sockets = sockets.filter((s) => s !== socket);
      console.error("TCP socket error:", err.message);
    });
  });

  tcpServer.listen(port, () => console.log(`✅ TCP Server listening on port ${port}`));

  tcpServer.on("error", (err) => console.error("TCP Server error:", err.message));

  return tcpServer;
}

export function stopTCPListener() {
  return new Promise((resolve) => {
    if (!tcpServer) return resolve({ status: 'TCP server not running', disconnectedSockets: 0 });

    const disconnectedSockets = sockets.length;

    // Destroy all active sockets
    sockets.forEach((s) => {
      try {
        s.destroy();
      } catch (err) {
        console.error("Error destroying socket:", err.message);
      }
    });
    sockets = [];

    const port = tcpServer.address()?.port;

    // Close the server
    tcpServer.close(() => {
      console.log(`🛑 TCP listener stopped on port ${port}. Disconnected ${disconnectedSockets} socket(s).`);
      tcpServer = null;
      resolve({ status: 'stopped', port, disconnectedSockets });
    });

    // Handle error in closing server
    tcpServer.on("error", (err) => {
      console.error("Error closing TCP server:", err.message);
      tcpServer = null;
      resolve({ status: 'error', error: err.message, disconnectedSockets });
    });
  });
}