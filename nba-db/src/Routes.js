import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Search from './components/SearchResults';
import Home from './components/Home';
import NotFound from './components/NotFound'
// import AuthenticatedRoute from "./components/AuthenticatedRoute";
// import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default ({ childProps }) =>
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} props={childProps}/>
      <Route path="/search" exact component={Search} props={childProps}/>
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>;