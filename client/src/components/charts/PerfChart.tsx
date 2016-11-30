import * as React from "react";
import Charts from "../../helpers/Charts";
import * as Chartjs from 'chart.js/src/chart.js'

export interface IChartData {
    time?: Array<number>,
    ttfb?: Array<number>,
    startRender?: Array<number>,
    speedIndex?: Array<number>,
    loadTime?: Array<number>,
    url?: Array<string>,
}

export interface IProps {
    chartData: IChartData
}

export default class PerfChart extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super();
    }
 
    perfMetricsChart: Chart

    drawCharts(chartData: IChartData) {
        let perfMetrics: HTMLCanvasElement = document.getElementById("perfMetrics") as HTMLCanvasElement;

        let dates: Array<Date> = chartData.time.map((date) => {
            return new Date(date);
        })

        let chartConfiguration: ChartConfiguration = {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'TTFB',
                    pointHitRadius: 15,
                    data: chartData.ttfb,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                },
                {
                    label: 'Start Render',
                    pointHitRadius: 15,
                    data: chartData.startRender,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                },
                {
                    label: 'Speed Index',
                    pointHitRadius: 15,
                    data: chartData.speedIndex,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                },
                {
                    label: 'Load Time',
                    pointHitRadius: 15,
                    data: chartData.loadTime,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                }]
            },
            options: Charts.GetChartOptions(dates)
        }

        this.perfMetricsChart = new Chartjs(perfMetrics, chartConfiguration) as Chart

        perfMetrics.onclick = (evt) => {
            var activePoints: Array<any> = this.perfMetricsChart.getElementsAtEvent(evt);
            if (activePoints[0]) window.open(chartData.url[activePoints[0]._index])
        };
    }

    shouldComponentUpdate(nextProps: IProps, nextState: any) {
        return this.props.chartData != nextProps.chartData;
    }

    componentWillUpdate(nextProps: IProps, nextState: any)
    {
        if (this.perfMetricsChart) this.perfMetricsChart.destroy();
        this.drawCharts(nextProps.chartData);
    }

    public render() {

        return <div className="row chart">
                <canvas id="perfMetrics" width="1600" height="400"></canvas>
            </div>

    }
}



