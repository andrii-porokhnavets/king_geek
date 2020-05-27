import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

import {Alert, Button} from 'react-bootstrap';

function Home() {
    const [countries, setCountries] = useState([]);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [error, setError] = useState('');
    const history = useHistory();

    const handleError = err => {
        setError(err.response.data.detail);
    }

    const getCountries = () => {
        axios.get('http://127.0.0.1:5000/countries')
            .then(res => {
                setCountries(res.data);
                setShouldLoad(res.data === 0)
            })
            .catch(handleError)
    }

    const putCountries = () => {
        axios.post('http://127.0.0.1:5000/countries')
            .catch(handleError)
            .then(getCountries)

    }

    useEffect(() => {
        getCountries();
    }, []);

  return (
      <div>
          {error && (
              <Alert variant="danger">{error}</Alert>
          )}

          {shouldLoad && (
              <div className="d-flex justify-content-center" style={{margin: 30}}>
                  <h3 className="mr-5">There is no countries data in the local database yet.</h3>
                  <Button onClick={() => putCountries()}>Insert data from an external API</Button>
              </div>
          )}

          {!shouldLoad && (
              <h2 className="text-center" style={{margin: 30}}>List of countries. Click on one to see data</h2>
          )}

          <div className="d-flex flex-wrap justify-content-between">
              {countries.map(country => (
                  <div key={country.id} className="m-1">
                      <Button variant="info" onClick={() => history.push('/' + country.iso2)}>
                          {country.name}
                      </Button>
                  </div>
              ))}
          </div>
      </div>
  )
}

export default Home;
