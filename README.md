Platform that allows to populate database with data about coronavirus

## Pre-requirements
Postgres server with database `DB_NAME` from `config.py`. Also `DB_USER` should have permissions interact to work with this database

### Tables

```sql
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    iso2 VARCHAR(2) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS stats (
    id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL,
    confirmed INTEGER NOT NULL,
    deaths INTEGER NOT NULL,
    recovered INTEGER NOT NULL,
    active INTEGER NOT NULL,
    date TIMESTAMP NOT NULL,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
);
```


## Backend

In the backend directory, please run:

To install all dependencies:
### `pipenv install`

To run server
### `python app.py`


## Frontend

In the frontend directory, please run:

To install all dependencies:
### `npm i`

To run server
### `npm start`
