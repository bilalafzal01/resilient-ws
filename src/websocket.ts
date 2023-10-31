type ResilientWSPingPongSettings = {
  enabled: boolean
  pingInterval?: number
  pingMessage?: string
}

type ResilientWSConstructorProps = {
  url: string
  onConnectCallback: () => void
  onDisconnectCallback: () => void
  onMessageCallback: (event: MessageEvent) => void
  onErrorCallback: (event: Event) => void
  pingPongSettings?: ResilientWSPingPongSettings
}

export type ResilientWSSendMessageProps = {
  attempt: number
  forceReconnect: boolean
  message: string
}

export default class ResilientWS {
  private static instance: ResilientWS
  private socket: WebSocket | null = null
  private url: string
  private onConnectCallback: () => void
  private onDisconnectCallback: () => void
  private onMessageCallback: (event: MessageEvent) => void
  private onErrorCallback: (event: Event) => void
  private pingPongSettings: ResilientWSPingPongSettings | undefined
  private pingPongInterval: NodeJS.Timeout | undefined

  private constructor(props: ResilientWSConstructorProps) {
    this.url = props.url
    this.onConnectCallback = props.onConnectCallback
    this.onDisconnectCallback = props.onDisconnectCallback
    this.onMessageCallback = props.onMessageCallback
    this.onErrorCallback = props.onErrorCallback
    this.pingPongSettings = props.pingPongSettings
    this.pingPongInterval = undefined

    this.initializeSocket()
  }

  private initializeSocket() {
    this.socket = new WebSocket(this.url)

    this.socket.addEventListener('open', () => this.onConnect())
    this.socket.addEventListener('close', () => this.onDisconnect())
    this.socket.addEventListener('message', (event) =>
      this.handleWSMessage(event)
    )
    this.socket.addEventListener('error', (event) => this.onError(event))

    if (this.pingPongSettings?.enabled) {
      this.pingPong()
    }
  }

  public static create(props: ResilientWSConstructorProps) {
    ResilientWS.instance = new ResilientWS(props)
  }

  public static getInstance(): ResilientWS | null {
    return ResilientWS.instance
  }

  public getSocketState(): number | undefined {
    return this.socket?.readyState
  }

  public close() {
    this.socket?.close()
  }

  // ! SECTION - Event Listeners

  private onConnect() {
    console.log('npm package - resilient-ws: WebSocket is connected')
    if (this.onConnectCallback) {
      this.onConnectCallback()
    }
  }

  private onDisconnect() {
    console.log('npm package - resilient-ws: WebSocket is disconnected')
    if (this.onDisconnectCallback) {
      this.onDisconnectCallback()
    }
    if (this.pingPongInterval) {
      clearInterval(this.pingPongInterval)
    }
  }

  private handleWSMessage(event: MessageEvent) {
    // console.log('npm package - resilient-ws: Received message on websocket')
    if (this.onMessageCallback) {
      this.onMessageCallback(event)
    }
  }

  private onError(event: Event) {
    console.error('npm package - resilient-ws: WebSocket error', event)
    if (this.onErrorCallback) {
      this.onErrorCallback(event)
    }
  }

  //   * SECTION - Ping Pong
  private async pingPong() {
    if (this.pingPongSettings && this.pingPongSettings?.enabled) {
      const pingIntervalNum = this.pingPongSettings?.pingInterval || 30000
      const pingMessage = this.pingPongSettings?.pingMessage || 'ping'
      this.pingPongInterval = setInterval(() => {
        console.log(
          'npm package - resilient-ws: Sending ping message on websocket'
        )
        this.send({
          message: pingMessage,
          attempt: 0,
          forceReconnect: false,
        })
      }, pingIntervalNum)
    }
  }

  // * SECTION - Public Methods
  public async send(props: ResilientWSSendMessageProps): Promise<boolean> {
    const maxAttempts = 5

    try {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(props.message)
        console.log(
          'npm package - resilient-ws: Successfully sent the message on websocket'
        )
        return true
      } else if (props.attempt < maxAttempts) {
        if (props.forceReconnect) {
          console.log(
            'npm package - resilient-ws: WebSocket is not open. Reconnecting...'
          )
          this.initializeSocket()
        }
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return await this.send({
          message: props.message,
          attempt: props.attempt + 1,
          forceReconnect: false,
        })
      } else {
        console.error(
          `npm package - resilient-ws: WebSocket did not open even after maximum attempts : ${maxAttempts}`
        )
        return false
      }
    } catch (err) {
      console.error(err)
      return false
    }
  }
}
