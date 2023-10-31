type ResilientWSPingPongSettings = {
  pingInterval?: number
  pingMessage?: string
}

class TestWS {
  private pingPongSettings: ResilientWSPingPongSettings | undefined
  private pingPongInterval: NodeJS.Timeout | undefined

  constructor(props: ResilientWSPingPongSettings) {
    this.pingPongSettings = props

    this.init()
  }

  private init() {
    this.pingPong()
  }

  private pingPong() {
    const pingIntervalNum = this.pingPongSettings?.pingInterval || 30000
    const pingMessage = this.pingPongSettings?.pingMessage || 'ping'
    this.pingPongInterval = setInterval(async () => {
      console.log(pingMessage)
    }, pingIntervalNum)
  }

  public close() {
    if (this.pingPongInterval) {
      clearInterval(this.pingPongInterval)
    }
  }
}

const main = () => {
  const testWS = new TestWS({
    pingInterval: 10000,
    pingMessage: 'pong',
  })

  setTimeout(() => {
    testWS.close()
  }, 50000)
}

main()
