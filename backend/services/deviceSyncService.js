let ioInstance = null;
const roomConnections = {};

function init(server) {
  const { Server } = require("socket.io");
  ioInstance = new Server(server, { cors: { origin: "*" } });

  ioInstance.on("connection", (socket) => {
    
    // 1. Phone generates pairing code
    socket.on("REQUEST_PAIRING_CODE", () => {
      const code = "CONTEXT-" + Math.floor(1000 + Math.random() * 9000);
      socket.join(code);
      socket.pairingCode = code; // Tag socket with the room
      if (!roomConnections[code]) roomConnections[code] = 0;
      roomConnections[code]++;
      socket.emit("PAIRING_CODE_GENERATED", code);
      console.log(`[Sync] Pairing code generated: ${code}`);
    });

    // 2. Laptop joins pairing code
    socket.on("JOIN_PAIRING_CODE", (code) => {
      socket.join(code);
      socket.pairingCode = code;
      if (!roomConnections[code]) roomConnections[code] = 0;
      roomConnections[code]++;
      
      console.log(`[Sync] Device joined: ${code}`);
      // Notify everyone in the room that a connection occurred
      ioInstance.to(code).emit("DEVICE_CONNECTED");
    });

    socket.on("LEAVE_PAIRING_CODE", (code) => {
      socket.leave(code);
      if (socket.pairingCode === code) {
        socket.pairingCode = null;
        roomConnections[code]--;
        ioInstance.to(code).emit("DEVICE_DISCONNECTED");
        if (roomConnections[code] <= 0) {
           delete roomConnections[code];
        }
      }
    });

    // 3. Shared Clipboard
    socket.on("CLIPBOARD_SYNC", ({ code, text }) => {
      console.log(`[Sync] Clipboard sent to ${code}`);
      socket.to(code).emit("CLIPBOARD_SYNC", text);
    });

    // 4. File Transfer Prototype
    socket.on("FILE_TRANSFER", ({ code, fileData, fileName }) => {
      console.log(`[Sync] File ${fileName} sent to ${code}`);
      socket.to(code).emit("FILE_TRANSFER", { fileData, fileName });
    });

    socket.on("disconnect", () => {
      if (socket.pairingCode) {
        roomConnections[socket.pairingCode]--;
        ioInstance.to(socket.pairingCode).emit("DEVICE_DISCONNECTED");
        if (roomConnections[socket.pairingCode] <= 0) {
           delete roomConnections[socket.pairingCode];
        }
        console.log(`[Sync] Device disconnected from ${socket.pairingCode}`);
      }
    });
  });
}

function broadcastUpdate(code, event, payload) {
  if (ioInstance && code) {
    console.log(`[Sync] Broadcasting ${event} to ${code}`);
    ioInstance.to(code).emit(event, payload);
  }
}

function resetSessions() {
  if (ioInstance) {
    ioInstance.disconnectSockets(true); // disconnect all sockets
    for (const key in roomConnections) {
      delete roomConnections[key];
    }
    console.log("[Sync] All sessions reset.");
  }
}

module.exports = { init, broadcastUpdate, resetSessions };
