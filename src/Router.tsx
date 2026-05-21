import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import PersonalInfo from './pages/PersonalInfo';
import Privacy from './pages/Privacy';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/personal-info" element={<PersonalInfo />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </BrowserRouter>
  );
}