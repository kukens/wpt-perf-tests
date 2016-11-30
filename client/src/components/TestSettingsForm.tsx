import * as React from "react";
import * as Promise from "bluebird";
import WebUtils from "../helpers/WebUtils";
import { hashHistory } from 'react-router'

export interface IForm {
    testUrl?: string,
    numberOfRuns?: number,
    locationDevice?: string,
    connection?: string,
    testInterval?: number
}

export interface IState extends IForm {
    errorMessage?: string,
    formSubmitted?: boolean
}

export interface IProps {
    params: IParams
}

export interface IParams {
    testId: string
}

export default class SessionSettingsForm extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            testUrl: '',
            numberOfRuns: 2,
            locationDevice: 'Dulles:Chrome',
            connection: 'Cable',
            testInterval: 30
        }

        if (this.props.params.testId) {
            WebUtils.fetchJSON('/tests/' + this.props.params.testId)
                .then(response => {
                    this.setState({
                        testUrl: response.testUrl,
                        numberOfRuns: response.numberOfRuns,
                        locationDevice: response.locationDevice,
                        connection: response.connection,
                        testInterval: response.testInterval                        
                    })
                })
        }
    }

    delete = () => {
        this.sendAndCheckStatus(WebUtils.fetchJSON('/tests/' + this.props.params.testId, 'DELETE'));
    }

    submit = () => {
        let formBody: IForm = {
            testUrl: this.state.testUrl,
            numberOfRuns: this.state.numberOfRuns,
            locationDevice: this.state.locationDevice,
            connection: this.state.connection,
            testInterval: this.state.testInterval        
        }

        let submitPromise: Promise<any>

        if (this.props.params.testId) {
            submitPromise = WebUtils.fetchJSON('/tests/' + this.props.params.testId, 'PUT', formBody)
        } else {
            submitPromise = WebUtils.fetchJSON('/tests', 'POST', formBody)
        }

        this.sendAndCheckStatus(submitPromise);
    }

    handleInputChange = (e: React.FormEvent<any>) => {
        this.setState({ [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value });
    }

    sendAndCheckStatus(request: Promise<any>){
        request.then(() => {
            this.setState({
                formSubmitted: true
            })
        }).catch((e) => {
            this.setState({
                errorMessage: e.message
            })
        }).then(() => {
            return Promise.delay(1500).then(() => {
                return hashHistory.goBack();
            })
        })
    }

    public render() {

        let modalHeader: JSX.Element;
        let deleteSessionButton: JSX.Element;
        let runTestButton: JSX.Element;

        if (this.props.params.testId) {
            modalHeader = < h3>Edit test</h3>
            deleteSessionButton = <button type="button" onClick={this.delete} id="delete-rule-btn" className="btn btn-danger">Delete test</button>
         } else {
            modalHeader = <h3>Add test</h3>
        };

        let messageBlock: JSX.Element;

        if (this.state.errorMessage) {
            messageBlock = <div className="alert alert-warning" role="alert">{this.state.errorMessage}</div>
        } else if (this.state.formSubmitted) {
            messageBlock = <div className="alert alert-success" role="alert">Form submitted.</div>
        }

        return <form id="modal-form">

            <div className="modal-header">
                {modalHeader}
            </div>
            <div className="modal-body">
                <fieldset>
                    <label htmlFor="testUrl">Test URL:</label>
                    <input className="form-control" required pattern="http[s]?:\/\/.*?$|\/.*" onChange={this.handleInputChange} type="text" name="testUrl" value={this.state.testUrl} />

                    <label htmlFor="alias">Number of runs:</label>
                    <input className="form-control" required onChange={this.handleInputChange} type="text" name="numberOfRuns" value={this.state.numberOfRuns.toString()} />

                    <label htmlFor="alias">Location:</label>
                    <input list='urls' className="form-control" required onChange={this.handleInputChange} type="text" name="locationDevice" value={this.state.locationDevice} />
                    <datalist id="urls">
                        <option value="Dulles:Chrome" />
                          <option value="ec2-us-east-1:Chrome" />
                        <option value="ec2-us-west-1:Chrome" />
                        <option value="ec2-eu-west-1:Chrome" />
                        <option value="ec2-eu-central-1:Chrome" />
                         <option value="ec2-ap-northeast-1:Chrome" />
                        <option value="ec2-ap-southeast-2:Chrome" />
                    </datalist>
                    <label htmlFor="alias">Device:</label>
                    <input className="form-control" required onChange={this.handleInputChange} type="text" name="connection" value={this.state.connection} />

                    <label htmlFor="alias">Test interval (minutes):</label>
                    <input className="form-control" required onChange={this.handleInputChange} type="text" name="testInterval" value={this.state.testInterval.toString()} />


                </fieldset>
            </div>

            <div className="modal-footer">
                {deleteSessionButton}
                <button onClick={() => hashHistory.goBack()} type="button" className="btn btn-default" data-dismiss="modal">Back</button>
                <button onClick={this.submit} type="button" id="update-test-btn" className="btn btn-primary">Submit</button>
            </div>

            {messageBlock}
        </form>
    }
}



