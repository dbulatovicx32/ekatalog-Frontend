import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { MainMenuItem, MainMenu } from './components/MainMenu/MainMenu';
import { HashRouter, Switch, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import ContactPage from './components/ContactPage/ContactPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import UserLoginPage from './components/UserLoginPage/UserLoginPage';
import UserRegistrationPage from './components/UserRegistrationPage/UserRegistrationPage';
import AdminLoginPage from './components/AdminLoginPage/AdminLoginPage';
import AdministratorDashboard from './components/AdministratorDashboard/AdministratorDashboard';

const menuItems = [
  new MainMenuItem("Home", "/"),
  new MainMenuItem("Contact", "/contact/"),
  new MainMenuItem("User log in", "/user/login/"),
  new MainMenuItem("Admin log in", "/administrator/login/"),
  new MainMenuItem("Register", "/user/register/"),
];

ReactDOM.render(
  <React.StrictMode>
    <MainMenu items={menuItems} />
    <HashRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/user/login" component={UserLoginPage} />
        <Route path="/administrator/login" component={AdminLoginPage} />
        <Route path="/user/register" component={UserRegistrationPage} />
        <Route path="/category/:cId" component={CategoryPage} />
        <Route path="/administrator/dashboard" component={AdministratorDashboard} />

      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
