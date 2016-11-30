import * as React from "react";
import * as Promise from "bluebird";
import WebUtils from "../helpers/WebUtils";
import Filter from "./Filter";
import { Link } from 'react-router'
import TestToggleLink from './TestToggleLink';

export interface IState {
    tests?: Array<ISession>,
    urls?: Array<string>
}

export interface ISession {
    _id: string,
    testUrl: string,
    locationDevice: string,
    connection: string,
    lastTest: string,
    running: boolean,
    testInterval: number
}

export default class Configuration extends React.Component<{}, IState> {

    constructor() {
        super();
        this.state = {
            tests: [],
            urls: []
        }
    }

    componentDidMount() {
        Promise.resolve(this.refreshDashboard());
    }

    refreshDashboard = (filterText: string = null): Promise<any> => {
        return this.refresh(filterText)
            .then(() => {
                return Promise.delay(60000);
            })
            .then(() => {
                return this.refreshDashboard()
            })
            .catch(e => {
                console.log(e);
            })
    }

    refresh = (filterText: string = null): Promise<any> => {
        let url = filterText ? '/tests?filter=' + filterText : '/tests';

        return WebUtils.fetchJSON(url)
            .then(response => {
               return this.setState({
                    tests: response.tests,
                    urls: response.urls
                })
            })
    }
   
    public render() {

        let testNodes = this.state.tests.map((test: ISession) => {

            let runningCaption: string = test.running ? 'Running...' : 'Iddle...';

            let lastTest: number = Math.round((Date.now() - Date.parse(test.lastTest)) / 60000);
            let nextTest: number = Math.round(30 - lastTest);

            return (
                <li key={test._id}>

                    <div className='test-summary'>
                        <div className="row">
                            <div className="col-md-7">
                                <a className='url-link' target='_blank' href={test.testUrl}>{test.testUrl}</a><span className="glyphicon glyphicon-new-window" aria-hidden="true"></span>
                            </div>
                            <div className="col-md-3">
                                {test.locationDevice}
                            </div>
                            <div className="col-md-2">
                                {test.connection}
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="rulesList">


                                <div className="col-md-3 metric">
                                    <h5>Status</h5>  <span className='metric ttfb'>{runningCaption}</span>
                                </div>
                                <div className="col-md-3 metric">
                                    <h5>Test interval</h5> <span className='metric start-render'>{test.testInterval + ' minutes'}</span>
                                </div>

                                <div className="col-md-2">
                                    <div className='link-details-container'>
                                        <TestToggleLink testId={test._id} running={test.running} refresh={this.refresh} />
                                        <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
                                    </div>
                                </div>

                                <div className="col-md-2">
                                    <div className='link-details-container'>
                                        <Link to={{ pathname: '/edit-test/' + test._id }} >Edit test</Link>
                                        <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
                                    </div>
                                </div>

                                <div className="col-md-2">
                                    <div className='link-details-container'>
                                        <Link to={{ pathname: '/history/' + test._id }}>Test history</Link>
                                        <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>

                                    </div>
                                </div>

                            </div>
                        </div >
                    </div >

                </li >
            );
        });

        return <div className="row">
            <div className="col-md-12" id="tests">
                <div id="tests-container">
                    <div className="col-md-4 mb-15">
                        <Link to={'/add-test'}>Add test test</Link>
                        <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
                    </div>
                    <div className="row">
                        <Filter urls={this.state.urls} refreshDashboard={this.refreshDashboard.bind(this)} />
                    </div>
                    <ul id="tests-list">{testNodes}</ul>
                </div>

            </div>

        </div>
    }
}



