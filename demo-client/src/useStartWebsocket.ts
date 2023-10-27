import { useEffect, useState } from 'react'

import { ResilientWS } from 'resilient-ws'

export const COPILOT_WS_BACKEND_ENDPOINT = `wss://ws-be.copilot.dnnsoftware.com`

export const useStartWebsocket = () => {
  const [connectionState, setConnectionState] = useState(`initial`)

  useEffect(() => {
    function onConnect() {
      console.log(`Wow this is a websocket connection!`)
      setConnectionState(`connected`)
    }

    function onDisconnect() {
      console.log(`Wow this is a websocket disconnection!`)
      setConnectionState(`disconnected`)
    }

    ResilientWS.create({
      url: `${COPILOT_WS_BACKEND_ENDPOINT}?token=bG9jYWxob3N0LmNvbTphNDJmYmUwNjlhZjNjY2FkOGVkYzczM2M0NjJhZWZhOTBmYjJjMjJj`,
      onConnectCallback: onConnect,
      onDisconnectCallback: onDisconnect,
      onMessageCallback: (message) => {
        console.log(`Wow this is a websocket message!`, message)
      },
      onErrorCallback: (error) => {
        console.log(`Wow this is a websocket error!`, error)
      },
    })
  }, [])

  useEffect(() => {
    if (connectionState === `connected`) {
      ResilientWS.getInstance()?.send({
        message:
          '{"action":"TRANSLATE","message_id":"msg-1234","attributes":{"input":"Hello, i am your virtual assistant","input_format":"PLAIN_TEXT","output_format":"PLAIN_TEXT","output_language":"fr"}}',
        attempt: 0,
        forceReconnect: true,
      })
    }
  }, [connectionState])

  return connectionState
}
