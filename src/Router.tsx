import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import PersonalInfo from './pages/PersonalInfo';
import Privacy from './pages/Privacy';
import AppPage from './pages/App';
import LinkPage from './pages/LinkPage';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/personal-info" element={<PersonalInfo />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/app" element={<AppPage />} />
        {/* Короткие ссылки ifou.ru/<ник или ссылка канала> и старые /u/, /c/.
            Статичные пути выше выигрывают у /:code. */}
        <Route path="/u/:code" element={<LinkPage />} />
        <Route path="/c/:code" element={<LinkPage />} />
        <Route path="/:code" element={<LinkPage />} />
      </Routes>
    </BrowserRouter>
  );
}