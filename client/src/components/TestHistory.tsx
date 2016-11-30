import * as React from "react";
import * as Promise from "bluebird";
import WebUtils from "../helpers/WebUtils";
import { Link } from 'react-router'
import PerfChart from './charts/PerfChart'
import TotalSizeChart from './charts/TotalSizeChart'
import PerfBudget from '../helpers/PerfBudget'


export interface IChartData {
    time?: Array<number>,
    ttfb?: Array<number>,
    startRender?: Array<number>,
    speedIndex?: Array<number>,
    loadTime?: Array<number>,
    url?: Array<string>,
    totalSize?: Array<number>
}

export interface IAverageValues {
    ttfbAverage?: number,
    startRenderAverage?: number,
    speedIndexAverage?: number,
    loadTimeAverage?: number,
    totalSizeAverage?: number
}


export interface IState {
    chartData?: IChartData,
    averageValues?: IAverageValues,
    testUrl?: string,
    locationDevice?: string,
    connection?: string,
    dateFrom?: string,
    dateTo?: string
}

export interface IProps {
    params: IParams,
    location: ILocation
}

export interface ILocation {
    pathname: string,
    query: {
        dateFrom: string,
        dateTo: string
    }
}


export interface IParams {
    testId: string
}


export default class Filter extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super();
        
        this.state = {
            dateFrom: props.location.query.dateFrom ? props.location.query.dateFrom : '',
            dateTo: props.location.query.dateTo ? props.location.query.dateTo : '',
            connection: '',
            locationDevice: '',
            testUrl:''
        }
    }

    filter = () => {
        WebUtils.fetchJSON('/test-results/' + this.props.params.testId + '?dateFrom=' + this.state.dateFrom + '&dateTo=' + this.state.dateTo)
            .then(response => {
                this.setState({
                    chartData: response.chartData,
                    averageValues: response.average
                })
            })
    }

    clearFilter = () => {
        WebUtils.fetchJSON('/test-results/' + this.props.params.testId)
            .then(response => {
                this.setState({
                    chartData: response.chartData,
                    averageValues: response.average,
                })
            })
    }


    handleDateChange = (e: React.FormEvent<any>) => {
        this.setState({ [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value });
    }


    componentDidMount() {
        WebUtils.fetchJSON('/test-results/' + this.props.params.testId + '?dateFrom=' + this.state.dateFrom + '&dateTo=' + this.state.dateTo)
            .then(response => {
                this.setState({
                    chartData: response.chartData,
                    averageValues: response.average,
                })
            })

        WebUtils.fetchJSON('/tests/' + this.props.params.testId)
            .then(response => {
                this.setState({
                    connection: response.connection,
                    locationDevice: response.locationDevice,
                    testUrl: response.testUrl,
                })
            })
    }

    public render() {

        let performanceMetricsAverageBlock: JSX.Element;

        let totalSizeAverageBlock: JSX.Element;

        if (this.state.averageValues) {

            performanceMetricsAverageBlock = <div className="row">
                <div className="col-md-12">
                    <div className="rulesList">
                        <div className="col-md-3 metric">
                            <h5>TTFB</h5>  <span className={PerfBudget.GetTTFBClassName(this.state.averageValues.ttfbAverage)}>{Math.round(this.state.averageValues.ttfbAverage)}</span>
                        </div>
                        <div className="col-md-3 metric">
                            <h5>Start Render </h5> <span className={PerfBudget.GetStartRenderClassName(this.state.averageValues.startRenderAverage)}>{Math.round(this.state.averageValues.startRenderAverage)}</span>
                        </div>
                        <div className="col-md-3 metric">
                            <h5>Speed Index</h5><span className={PerfBudget.GetSpeedIndexClassName(this.state.averageValues.speedIndexAverage)}> {Math.round(this.state.averageValues.speedIndexAverage)}</span>
                        </div>
                        <div className="col-md-3 metric">
                            <h5>Load Time</h5> <span className={PerfBudget.GetLoadTimeClassName(this.state.averageValues.loadTimeAverage)}> {Math.round(this.state.averageValues.loadTimeAverage)}</span>
                        </div>
                    </div>
                </div >
            </div >

            totalSizeAverageBlock = <div className="row">
                <div className="col-md-12">
                    <div className="rulesList">
                        <div className="col-md-12 metric">
                            <h5>Total Size</h5><span className={PerfBudget.GetTotalSizeClassName(this.state.averageValues.totalSizeAverage)}>{Math.round(this.state.averageValues.totalSizeAverage / 1024)}KB</span>
                        </div>
                    </div>
                </div >
            </div>
        }

        return <div className="col-md-12">
            <div className="row">
                <div className="input-group form-inline">
                    <span className="input-group-addon">From: </span>
                    <input onChange={this.handleDateChange} type="date" className="form-control" name="dateFrom" value={this.state.dateFrom} />
                    <span className="input-group-addon">To: </span>
                    <input onChange={this.handleDateChange} type="date" className="form-control" name="dateTo" value={this.state.dateTo} />

                    <div className="input-group-btn">

                        <Link to={{ pathname: this.props.location.pathname }} onClick={this.clearFilter} type="button" className="btn btn-primary">
                            Clear
                                  </Link>
                        <Link to={{ pathname: this.props.location.pathname, query: { dateFrom: this.state.dateFrom, dateTo: this.state.dateTo } }} onClick={this.filter} type="button" className="btn btn-primary">
                            Filter
                                   </Link>
                    </div>
                </div>
            </div>


            <div className='row test-summary'>
                <div className="row">
                    <div className="col-md-7">
                        <a className='url-link' target='_blank' href={this.state.testUrl}>{this.state.testUrl}</a><span className="glyphicon glyphicon-new-window" aria-hidden="true"></span>
                    </div>
                    <div className="col-md-3 center">
                        {this.state.locationDevice}
                    </div>
                    <div className="col-md-2 center">
                        {this.state.connection}
                    </div>

                </div>
            </div>
    

            {performanceMetricsAverageBlock}

            <PerfChart chartData={this.state.chartData} />

            {totalSizeAverageBlock}

            <TotalSizeChart chartData={this.state.chartData} />
        </div>

    }
}



