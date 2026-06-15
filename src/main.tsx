import { render } from 'preact'
import { App } from './App'
// import './styles/index.css'
import './sdk'

// Dev preview — simulasi SDK init
window.his_ai_widget.init({ userName: 'dr. Budi Santoso', theme: 'light' })

render(<App />, document.getElementById('app')!)
