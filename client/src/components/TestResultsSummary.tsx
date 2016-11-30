import * as React from "react";
import * as Promise from "bluebird";
import WebUtils from "../helpers/WebUtils";
import PerfBudget from '../helpers/PerfBudget';
import { Link } from 'react-router';

export interface IAverageValues {
    ttfbAverage?: number,
    startRenderAverage?: number,
    speedIndexAverage?: number,
    loadTimeAverage?: number,
    totalSizeAverage?: number
}


export interface IState {
    averageValues?: IAverageValues,
}

export interface IProps {
    testId?: string,
}

export default class TestResultsSummary extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super();
        this.state = {
            
        }
    }

  componentDidMount() {
        WebUtils.fetchJSON('/test-results/' + this.props.testId)
            .then(response => {
                this.setState({
                    averageValues: response.average,
                })
            })
}

    public render() {

        let metricsAverageBlock: JSX.Element;

        if (this.state.averageValues)

        {
            metricsAverageBlock = <div className="col-md-12">
                <div className="rulesList">


                    <div className="col-md-2 metric">
                        <h5>TTFB</h5>  <span className={PerfBudget.GetTTFBClassName(this.state.averageValues.ttfbAverage)}>{Math.round(this.state.averageValues.ttfbAverage)}</span>
                    </div>
                    <div className="col-md-2 metric">
                        <h5>Start Render </h5> <span className={PerfBudget.GetStartRenderClassName(this.state.averageValues.startRenderAverage)}>{Math.round(this.state.averageValues.startRenderAverage)}</span>
                    </div>
                    <div className="col-md-2 metric">
                        <h5>Speed Index</h5><span className={PerfBudget.GetSpeedIndexClassName(this.state.averageValues.speedIndexAverage)}> {Math.round(this.state.averageValues.speedIndexAverage)}</span>
                    </div>
                    <div className="col-md-2 metric">
                        <h5>Load Time</h5> <span className={PerfBudget.GetLoadTimeClassName(this.state.averageValues.loadTimeAverage)}> {Math.round(this.state.averageValues.loadTimeAverage)}</span>
                    </div>
                    <div className="col-md-2 metric">
                        <h5>Total Size</h5><span className={PerfBudget.GetTotalSizeClassName(this.state.averageValues.totalSizeAverage)}>{Math.round(this.state.averageValues.totalSizeAverage / 1024)}KB</span>
                    </div>
                    <div className="col-md-2">
                        <div className='link-details-container'>
                            <Link to={{ pathname: '/history/' + this.props.testId }}>Test history</Link>
                            <span className="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
                        </div>
                    </div>

                </div>
            </div >
        }

        return <div className="row">
            {metricsAverageBlock}
                    </div >
    
    }
}



