import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import TeatroDislocadorApp from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TeatroDislocadorApp />} />
        </Routes>
      </BrowserRouter>
  </StrictMode>,
)