import React from 'react';
import { Switch, Route } from "react-router-dom";
import { Container } from 'react-bootstrap';

import Home from "./Home";
import Country from "./Country";

function Main() {
    return (
        <Container>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route exact path="/:countryCode">
                    <Country />
                </Route>
            </Switch>
        </Container>
    )
}

export default Main;
