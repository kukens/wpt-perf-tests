import * as React from "react";
import * as Promise from 'Bluebird';
import WebUtils from "../helpers/WebUtils";


export interface IProps {
    testId?: string,
    running?: boolean,
    refresh?: any
}


export default class TestToggleLink extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super();
    }

    testToggle = (e: React.MouseEvent<any>) => {
        e.preventDefault();

        Promise.resolve()
            .then(() => {

                if (this.props.running) return WebUtils.fetchJSON('/tests/' + this.props.testId + '/session', 'DELETE');
                else return WebUtils.fetchJSON('/tests/' + this.props.testId + '/session', 'POST');
            })
            .then(() => {
                this.props.refresh();
            })
    }

    public render() {

        let linkCaption: string = this.props.running ? 'Stop tests' : 'Start tests'

        return (
            <a onClick={this.testToggle} href='#'>{linkCaption}</a>
        );
    }
}



