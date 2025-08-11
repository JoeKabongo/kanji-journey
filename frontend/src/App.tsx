import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import KanjiListPage from './pages/KanjiListPage'
import Login from './pages/Login'

function App() {
  return (
    <div className="pt-20">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kanjis/:jlptLevel" element={<KanjiListPage />} />
          <Route path="/kanjis" element={<KanjiListPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
