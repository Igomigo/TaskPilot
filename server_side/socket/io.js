let io;

function setIo(ioInstance) {
    // Sets the io instance
    io = ioInstance;
}

function getIo() {
    if (!io) {
        throw new Error("Socket.io instance has not been initialized");
    }
    return io;
}

module.exports = { setIo, getIo };