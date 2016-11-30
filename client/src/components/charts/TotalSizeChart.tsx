import * as React from "react";
import Charts from "../../helpers/Charts";
import * as Chartjs from 'chart.js/src/chart.js'

export interface IChartData {
    time?: Array<number>,
    totalSize?: Array<number>,
    url?: Array<string>
}

export interface IProps {
    chartData: IChartData
}

export default class PerfChart extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super();
    }

    totalSizeChart: Chart

    drawCharts(chartData: IChartData) {
        let dates: Array<Date> = chartData.time.map((date) => {
            return new Date(date);
        })

        let totalSize: HTMLCanvasElement = document.getElementById("totalSize") as HTMLCanvasElement;

        let chartConfiguration: ChartConfiguration = {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Total Size',
                        pointHitRadius: 15,
                        data: chartData.totalSize,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)'
                    }]
            },
            options: Charts.GetChartOptions(dates)
        };

        this.totalSizeChart = new Chartjs(totalSize, chartConfiguration) as Chart

        totalSize.onclick = (evt) => {
            var activePoints: Array<any> = this.totalSizeChart.getElementsAtEvent(evt);
            if (activePoints[0]) window.open(chartData.url[activePoints[0]._index])
        };
    }

    shouldComponentUpdate(nextProps: IProps, nextState: any) {
        return this.props.chartData != nextProps.chartData;
    }

    componentWillUpdate(nextProps: IProps, nextState: any)
    {
        if (this.totalSizeChart) this.totalSizeChart.destroy();
        this.drawCharts(nextProps.chartData);
    }

    public render() {

        return <div className="row chart">
                <canvas id="totalSize" width="1600" height="400"></canvas>
            </div>
    }
}



