import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import { useHistory } from "react-router-dom";

import { Button, Alert } from 'react-bootstrap';
import Chart from "./Chart";
const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page B', uv: 200, pv: 1400, amt: 2000},];


function Country() {
    const { countryCode } = useParams();
    const history = useHistory();
    const [stats, setStats] = useState([]);
    const [country, setCountry] = useState({});
    const [error, setError] = useState('');
    const baseUrl = 'http://127.0.0.1:5000/';

    const handleError = err => {
        setError(err.response.data.detail);
    }

    const getCountry = () => {
        return axios.get(baseUrl + 'countries/' + countryCode)
            .then(res => {
                setCountry(res.data);
            })
            .catch(handleError)
    }

    const getStats = () => {
        axios.get(baseUrl + 'stats/' + countryCode)
            .then(res => {
                setStats(res.data);
                if (res.data.length !== 0) {
                    setError('');
                }
            })
            .catch(handleError)
    }

    const putStats = () => {
        axios.post(baseUrl + 'stats/' + countryCode, {country_id: country.id})
            .catch(handleError)
            .then(getStats)

    }

    useEffect(() => {getCountry().then(getStats)}, []);


  return (
      <div>
          {error && (
              <Alert variant="danger">{error}</Alert>
          )}

          <div style={{margin: 30}}>
              <Button variant="link" onClick={() => history.push('/') }>
                  {'< Back to the list of countries'}
              </Button>
              <h2 className="text-center">{countryCode.toUpperCase()} - {country.name}</h2>
          </div>

          {stats.length === 0 && (
              <div className="d-flex justify-content-center">
                  <h3 className="mr-5">There is no data for this country in the local database yet.</h3>
                  <Button onClick={() => putStats()}>Insert data from an external API</Button>
              </div>
          )}

          <div className="d-flex justify-content-center">
              <Chart data={stats}/>
          </div>
      </div>
  )
}

export default Country;
