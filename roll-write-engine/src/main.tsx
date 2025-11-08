import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { yahtzeeConfig } from './games/yahtzee'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App config={yahtzeeConfig} />
  </StrictMode>,
)
