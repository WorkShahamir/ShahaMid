import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CountriesListPage from './pages/CountriesListPage';
import CountryDetailPage from './pages/CountryDetailPage';
import CreateTravelPlanPage from './pages/CreateTravelPlanPage';
import EditTravelPlanPage from './pages/EditTravelPlanPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CountriesListPage />} />
        <Route path="/country/:code" element={<CountryDetailPage />} />
        <Route path="/create" element={<CreateTravelPlanPage />} />
        <Route path="/edit/:id" element={<EditTravelPlanPage />} />
      </Routes>
    </Router>
  );
}

export default App;
