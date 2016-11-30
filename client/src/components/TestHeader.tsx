import * as React from "react";
import * as Promise from "bluebird";
import WebUtils from "../helpers/WebUtils";

import { Link } from 'react-router'

export interface IState {
    filterText?: string
}

export interface IProps {
    urls: Array<string>,
    refreshDashboard: any,
}


export default class Filter extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super();
        this.state = {
            filterText: ''
        }
    }

    filterUrls() {
        this.props.refreshDashboard(this.state.filterText);
    }

    clearFilter() {
        this.setState({ filterText: '' })
        this.props.refreshDashboard();
    }

    handleFilterTextChange = (e: React.FormEvent<any>) => {
        this.setState({ filterText: (e.target as HTMLInputElement).value });
    }

    public render() {


        var testUrls = this.props.urls.map(function (url: string) {
            return (
                <option key={url} value={url} />
            );
        }.bind(this));

        return <div className="col-md-12">
            
            <div className="input-group form-inline">
                  <span className="input-group-addon">Test URLs: </span>
                    <input list='urls' placeholder='All' onChange={this.handleFilterTextChange} className="form-control" type="text" name="filterText" value={this.state.filterText} />
                    <datalist id="urls">
                        {testUrls}
                    </datalist>
                    <div className="input-group-btn">
                        <button onClick={this.clearFilter.bind(this)} id="add-test-btn" type="button" className="btn btn-primary">
                            Clear
                                  </button>
                        <button onClick={this.filterUrls.bind(this)} id="add-test-btn" type="button" className="btn btn-primary">
                            Filter
                                   </button>
                    </div>
                </div>
            </div>
    
    }
}



