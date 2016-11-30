import * as React from "react";
import * as Promise from "bluebird";
import WebUtils from "../helpers/WebUtils";
import Filter from "./Filter";
import { Link } from 'react-router'
import PerfBudget from '../helpers/PerfBudget'
import TestResultsSummary from './TestResultsSummary';

export interface IState {
    tests?: Array<ISession>,
    urls?: Array<string>
}

export interface ISession {
    _id: string,
    testUrl: string,
    locationDevice: string,
    connection: string,
}

export default class Tests extends React.Component<{}, IState> {

    constructor() {
        super();
        this.state = {
            tests: [],
            urls: []
        }
    }

    componentDidMount() {
        this.refreshDashboard();
    }

    refreshDashboard = (filterText: string = null)=> {

        let url = filterText ? '/tests?filter=' + filterText : '/tests';

        WebUtils.fetchJSON(url)
            .then(response => {
                this.setState({
                    tests: response.tests,
                    urls: response.urls
                })
            })
    }

    getMetricStyle(value: number) {


    }


    public render() {

        let testNodes = this.state.tests.map((test: ISession) => {

            return (
                <li key={test._id}>

                    <div className='test-summary'>
                        <div className="row">
                            <div className="col-md-7">
                                <a className='url-link' target='_blank' href={test.testUrl}>{test.testUrl}</a><span className="glyphicon glyphicon-new-window" aria-hidden="true"></span>
                            </div>
                            <div className="col-md-3 center">
                                {test.locationDevice}
                            </div>
                            <div className="col-md-2 center">
                                {test.connection}
                            </div>
                          
                        </div>
                    </div>
                    <TestResultsSummary testId={test._id} />

                </li >
            );
        });

        return <div className="row">
            <div className="col-md-12" id="tests">
                <div id="tests-container">
                    <div className="row">
                        <Filter urls={this.state.urls} refreshDashboard={this.refreshDashboard} />
                    </div>
                    <ul id="tests-list">{testNodes}</ul>
                </div>

            </div>

        </div>
    }
}



