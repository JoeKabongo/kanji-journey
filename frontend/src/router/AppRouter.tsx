import { BrowserRouter, Route, Routes } from 'react-router'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
