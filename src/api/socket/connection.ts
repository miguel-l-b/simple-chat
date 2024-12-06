import { Socket, io } from "socket.io-client"
import ApiConsts from "../../constants/ApiConsts"

export class SocketConnection {
  private static socket: Socket
  static connect(token: string) {
    console.log('Connecting to server')
    this.socket = io(ApiConsts.BASE_URL, {
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