import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Sidebar from './components/sidebar/sidebar.tsx'
import { Toaster } from "@/components/ui/sonner"



createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <Sidebar />
    <Toaster />
  </StrictMode>,
)
