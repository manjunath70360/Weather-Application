
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WeatherPage from './components/weatherPage/index';
import CitiesTable from './components/citiesTable/index';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<CitiesTable />} />
      <Route path="/weather/:city" element={<WeatherPage />} />
    </Routes>
  </Router>
);

export default App;
