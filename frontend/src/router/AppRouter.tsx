import { BrowserRouter, Route, Routes } from 'react-router'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import KanjiListPage from '../pages/KanjiListPage'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kanjis/:jlptLevel" element={<KanjiListPage />} />
        <Route path="/kanjis" element={<KanjiListPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
