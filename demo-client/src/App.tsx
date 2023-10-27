import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useStartWebsocket } from './useStartWebsocket'

function App() {
  const connectionState = useStartWebsocket()

  return (
    <>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <p>Connection state: {connectionState}</p>
      </div>
    </>
  )
}

export default App
