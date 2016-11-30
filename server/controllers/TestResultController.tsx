import * as Express from 'express'
import TestResult from '../models/mongoose/TestResultModel.js';
import { ITestResultModel } from '../models/mongoose/TestResultModel.js';

class Metrics {

    constructor()
    {
        this.time = new Array<Date>();
        this.ttfb = new Array<number>();
        this.startRender = new Array<number>();
        this.speedIndex = new Array<number>();
        this.loadTime = new Array<number>();
        this.url = new Array<string>();
        this.totalSize = new Array<number>();
    }

    time: Array<Date>;
    ttfb: Array<number>;
    startRender: Array<number>;
    speedIndex: Array<number>;
    loadTime: Array<number>;
    url: Array<string>;
    totalSize: Array<number>;
}

class Average {
    ttfbAverage: number;
    startRenderAverage: number;
    speedIndexAverage: number;
    loadTimeAverage: number;
    totalSizeAverage: number;
}

export default class TestResultController {

    static matchTestId(req: Express.Request) {
        return req.path.match(/\/.*\/([a-z0-9]{24})/)[1];
    }

    static getAverageValues(metrics: Metrics) {
        let average = new Average();

        average.ttfbAverage = this.calculateAverage(metrics.ttfb);
        average.startRenderAverage = this.calculateAverage(metrics.startRender);
        average.speedIndexAverage = this.calculateAverage(metrics.speedIndex);
        average.loadTimeAverage = this.calculateAverage(metrics.loadTime);
        average.totalSizeAverage = this.calculateAverage(metrics.totalSize);

        return average
    }

    static calculateAverage(metrics: number[]) {
        if (metrics && metrics.length > 0) return metrics.reduce((a, b)=> { return a + b; }) / metrics.length
        else return 0;
    }


    public static getTestResults(req: Express.Request, res: Express.Response, next: Express.NextFunction) {

        let dateFrom: Date= req.query.dateFrom ? new Date(req.query.dateFrom) : new Date(Date.now() - 186400000);
        let dateTo: Date = req.query.dateTo ? new Date(new Date(req.query.dateTo).setDate(new Date(req.query.dateTo).getDate() + 1)) : new Date(Date.now());

        TestResult.find({ testId: this.matchTestId(req), finishDate: { "$gte": dateFrom, "$lte": dateTo } }).exec()
            .then((results: Array<ITestResultModel>) => {
                let metrics = new Metrics();

                for (let result of results) {
                    metrics.time.push(result.finishDate);
                    metrics.ttfb.push(result.ttfb);
                    metrics.startRender.push(result.startRender);
                    metrics.speedIndex.push(result.speedIndex);
                    metrics.loadTime.push(result.loadTime);
                    metrics.totalSize.push(result.totalSize);
                    metrics.url.push(result.wptUrl);
                }

                return res.json({ chartData: metrics, average: this.getAverageValues(metrics) });

            })
            .catch((err: Error) => next(err))
    }
}