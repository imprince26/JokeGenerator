import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import JokeTeller from './JokeTeller'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JokeTeller />
  </StrictMode>,
)
