import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// pega a div "root" do index.html e coloca o App dentro dela
createRoot(document.getElementById('root')!).render(<App />)
