"use client"

import { useEffect, useState } from 'react';
import { getApiRoutes } from '../AppRoutes/apiRoutesHandler';

const apiRoutes = getApiRoutes();

export function TCPDashboard() {
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const [logs, setLogs] = useState([]);
  
    // Fetch logs every 1s
    useEffect(() => {
      const interval = setInterval(async () => {
        const res = await fetch(apiRoutes.tcp.logs);
        const data = await res.json();
        setLogs(data.logs);
      }, 3000);
      return () => clearInterval(interval);
    }, []);
  
    async function startTCP() {
      setStatus("Starting TCP Tunnel...")  
      const res = await fetch(apiRoutes.tcp.start);
      const data = await res.json();
      setStatus(data.status);
    }
  
    async function stopTCP() {
       setStatus("Stopping TCP Tunnel...")  
      const res = await fetch(apiRoutes.tcp.stop, { method: 'DELETE' });
      const data = await res.json();
      setStatus(data.status);
    }
  
    async function sendMessage() {
      if (!message) return;
      setStatus('Sending tcp message ...')
      const res = await fetch(apiRoutes.tcp.send, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      await res.json();
      setStatus("Message sent...")  
      setMessage('');
    }
  
    return (
      <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content container-fluid p-0 m-0">
      <div className=" col-md-12 p-4">
        <h1 className="text-2xl font-bold mb-4">TCP Control Dashboard</h1>
  
        <div className="mb-4">
          <button onClick={startTCP} className="btn btn-primary mr-2">Start TCP</button>
          <button onClick={stopTCP} className="btn btn-danger">Stop TCP</button>
          <span className="ml-4 font-semibold">{status}</span>
        </div>
  
        <div className="mb-4 col-md-10 my-3 row justify-content-start p-0 m-0 ">
          <input
            className="form-control border p-1 rounded mr-2 col-md-6"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message to TCP server"
          />
          <button onClick={sendMessage} className="btn btn-info ml-2 "><i className='fa fa-send'></i> Send</button>
        </div>
  
        <div>
          <h2 className="font-bold mb-2 col-md-12 my-3">TCP Logs (last 100)</h2>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="border p-2 rounded max-h-64 overflow-y-auto bg-gray-50">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      </div>
      </div>
      </div>
      </div>
    );
  }
  