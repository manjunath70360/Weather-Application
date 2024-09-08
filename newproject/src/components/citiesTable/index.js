import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { BeatLoader } from "react-spinners";
import './index.css';

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const tbodyRef = useRef(null);

  const handleSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
      setCities([]); 
      setPage(1); 
    }, 300),
    []
  );

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${searchTerm}&rows=20&start=${(page - 1) * 20}`
        );
        setCities((prevCities) => [...prevCities, ...response.data.records]);
        setHasMore(response.data.records.length > 0);
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [page, searchTerm]);

  const loadMore = () => setPage((prevPage) => prevPage + 1);

  const handleScroll = () => {
    if (tbodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tbodyRef.current;
      if (scrollHeight - scrollTop === clientHeight && hasMore) {
        loadMore();
      }
    }
  };

  return (
    
    <div className="app-container-home">
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Search city..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="table-container">
        {loading && !cities.length ? ( 
          <div className="loading-spinner"><BeatLoader color="skyblue" /></div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>City</th>
                  <th>Country</th>
                  <th>Timezone</th>
                </tr>
              </thead>
              <tbody
                className="table-row"
                ref={tbodyRef}
                onScroll={handleScroll}
                style={{
                  display: 'block',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  width: '100%',
                }}
              >
                {cities.map((city, index) => (
                  <tr
                    key={`${city.recordid}-${index}`}
                    style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}
                  >
                    <td>
                      <Link className="name" to={`/weather/${city.fields.name}`}>
                        {city.fields.name}
                      </Link>
                    </td>
                    <td>{city.fields.cou_name_en}</td>
                    <td>{city.fields.timezone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!hasMore && <p>No more cities to display.</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default CitiesTable;
