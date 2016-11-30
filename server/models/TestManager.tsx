import Test from '../models/mongoose/TestModel';
import { ITestModel } from '../models/mongoose/TestModel';
import TestResult from '../models/mongoose/TestResultModel.js';
import { ITestResultModel } from '../models/mongoose/TestResultModel.js';
import wptConfig from '../config/wptConfig.js';

import * as https from 'https';
import * as Promise from "bluebird";


export default class TestManager {

    public static initTestSessions() {
        Test.find({ 'running': true }).exec()
            .then((tests: Array<ITestModel>) => {

                for (let test of tests) {

                    TestResult.find({ 'testId': test._id }).exec()
                        .then((testResults: Array<ITestResultModel>) => {
                            if (testResults.length > 0)
                            {
                               return TestResult.find({ 'testId': test._id }).sort({ finishDate: 'desc' }).limit(1).exec()
                                    .then((testResults: Array<ITestResultModel>) => {

                                        let initDelay: number = (test.testInterval * 60000) - (Date.now() - Date.parse(testResults[0].finishDate.toString()))
                                        if (initDelay < 0) initDelay = 0;

                                        console.log(test._id + ' - next test hin ' + Math.round(initDelay / 60000) + ' minutes');

                                       return TestManager.startTestSession(test._id, initDelay);
                                    })
                            } else {
                                return TestManager.startTestSession(test._id);
                            }
                        })
                        .catch(e => {
                            console.log(e);
                        })
                }
            })
    }

    public static startTestSession(testId: any, initDelay: number = 0) {
        
        var loopTest = (): any => {
            return Test.findOne({ '_id': testId }).exec()

                .then((test: ITestModel) => {

                    if (test.running) {
                        let apiKey: string = wptConfig.apiKey;
                        let wptTestUrl: string = 'https://www.webpagetest.org/runtest.php?k=' + apiKey + '&runs=' + test.numberOfRuns + '&location=' + test.locationDevice + '&video=1&medianMetric=SpeedIndex&fvonly=1&bodies=1&script=navigate%09' + encodeURIComponent(test.testUrl) + '&f=json';

                        TestManager.runTest(wptTestUrl)
                            .then(testResult => {
                                testResult.testId = testId;
                                console.log(testResult);
                                var testResultModel = new TestResult(testResult);
                                return testResultModel.save();
                            })
                            .catch((e) => {
                                console.log(e)
                            })
                    }


                    return test.testInterval;
                })
                .then((testInterval: number) => {
                    return Promise.delay(testInterval * 60000)
                })
                .then(() => {
                    return loopTest()
                })
        }

        Promise.delay(initDelay)
            .then(() => {
                return loopTest();
            })
            .catch((e) => {
                console.log(e)
            })
    }


    static runTest(url: string) {

        var checkTestStatus:any = (jsonUrl: string) => {
            return Promise.delay(5000).then(() => {
                return TestManager.requestPromise(jsonUrl)
            })
                .then((body) => {
                    var responseObject = JSON.parse(body);
                    console.log(responseObject.data.testId + ' - ' + responseObject.statusText);
                    if (responseObject.statusCode == 200) {

                        var testResult = {
                            ttfb: responseObject.data.median.firstView.TTFB,
                            speedIndex: responseObject.data.median.firstView.SpeedIndex,
                            startRender: responseObject.data.median.firstView.render,
                            loadTime: responseObject.data.median.firstView.loadTime,
                            totalSize: responseObject.data.median.firstView.bytesIn,
                            finishDate: new Date(Date.now()),
                            wptUrl: responseObject.data.summary
                        }
                        
                        return testResult;
                    }
                    return checkTestStatus(jsonUrl);
                })
        }

        return TestManager.requestPromise(url)
            .then(body => {
                var responseObject = JSON.parse(body);
                return responseObject.data.jsonUrl;
            })
            .then((jsonUrl: string) => {
                return checkTestStatus(jsonUrl)
            })
            .catch(e => {
                console.log(e);
            })
    }



    static requestPromise(requestUrl: string): Promise<any>
    {
        return new Promise((resolve, reject) => {
            https.get(requestUrl, res => {

                var body = '';

                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on('end', () => {
                    resolve(body);
                });
            })
        })
    }
}