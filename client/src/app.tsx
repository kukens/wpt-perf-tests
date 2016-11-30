import * as React from "react";
import * as ReactDOM from "react-dom";

import Dashboard from "./components/Dashboard";
import TestSettingsForm from "./components/TestSettingsForm";
import TestHistory from "./components/TestHistory";
import Configuration from "./components/Configuration";

import { Router, Route, IndexRoute, hashHistory, Link } from 'react-router'

import "./app.less";
import "../assets/css/bootstrap.min.css";
import "../assets/fonts/glyphicons-halflings-regular.eot";
import "../assets/fonts/glyphicons-halflings-regular.svg";
import "../assets/fonts/glyphicons-halflings-regular.ttf";
import "../assets/fonts/glyphicons-halflings-regular.woff";
import "../assets/fonts/glyphicons-halflings-regular.woff2";

import "../views/error.html";
import "../views/index.html";
import "../views/layout.html";

export class App extends React.Component<{}, {}> {

    render() {
        return <div>

            <div className="row user-profile">
                <div className="col-md-6">
                    <h1>WPT Performance Tests </h1>
                </div>
                <div className="col-md-6">
                    <ul className="nav nav-pills">
                        <li role="presentation"><Link to="/">Dashboard</Link></li>
                        <li role="presentation"><Link to="configuration">Configuration</Link></li>
                    </ul>
                </div>
            </div>
            {this.props.children}
        </div>
    }
}





ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Dashboard} />
            <Route path="configuration" component={Configuration} />
            <Route path="edit-test/:testId" component={TestSettingsForm} />
            <Route path="add-test" component={TestSettingsForm} />
            <Route path="history/:testId" component={TestHistory} />
        </Route>
    </Router>

), document.getElementById('main-container'))