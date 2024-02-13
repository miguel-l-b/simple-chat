import { Socket, io } from "socket.io-client"

export class SocketConnection {
  private static socket: Socket
  static connect(token: string) {
    console.log('Connecting to server')
    this.socket = io('http://localhost:3030', {
      auth: {
        token
      },
      transports: ['websocket']
    })
    this.socket.on('connect', () => {
      console.log('Connected to server')
    })
    return this.socket
  }

  static disconnect() {
    this.socket.disconnect()
  }

  static getConnection() {
    return this.socket
  }
}