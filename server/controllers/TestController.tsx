import TestManager from '../models/TestManager';
import * as Express from 'express'
import Test from '../models/mongoose/TestModel.js';
import { ITestModel } from '../models/mongoose/TestModel.js';
import * as Promise from 'bluebird';

export default class TestResultController {

   public static matchTestId(req: Express.Request) {
        return req.path.match(/\/tests\/([a-z0-9]{24})/)[1]
    }

   public static getTests(req: Express.Request, res: Express.Response, next: Express.NextFunction) {

       let urlsPromise = Test.find().distinct('testUrl').exec()
       let testsPromise: any;

        if (req.query.filter) testsPromise = Test.find({ testUrl: req.query.filter }, { tests: 0 }).exec()
        else testsPromise = Test.find({}, { tests: 0 }).exec()

        Promise.all([urlsPromise, testsPromise])
            .then((result: Array<Array<ITestModel>>) => {
                res.json({ urls: result[0], tests: result[1] })
            })
            .catch((err: Error) => next(err))
    }

   public static getTest(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        let testId = this.matchTestId(req);
        Test.findOne({ _id: testId }, { tests: 0 }).exec()
            .then((result: ITestModel) => {
                res.json(result)
            })
            .catch((err: Error) => next(err))
    }

   public static editTest(req: Express.Request, res: Express.Response, next: Express.NextFunction) {

        let testId = this.matchTestId(req);

        Test.update({ _id: testId }, req.body).exec()
            .then(() => res.json({}))
            .catch((err: Error) => next(err))
    }

   public static addTest(req: Express.Request, res: Express.Response, next: Express.NextFunction) {


        var newTest = new Test(req.body);

        newTest.save()
            .then(() => res.json({}))
            .catch((err: Error) => next(err))
    }

   public static deleteTest(req: Express.Request, res: Express.Response, next: Express.NextFunction) {

        let testId = this.matchTestId(req);

        Test.remove({ _id: testId }).exec()
            .then(() => res.json({}))
            .catch((err: Error) => next(err))
    }

   public static startTest(req: Express.Request, res: Express.Response, next: Express.NextFunction) {

        let testId = this.matchTestId(req);

        console.log(testId);

        Test.update({ _id: testId }, { running: true }).exec()
            .then(() => {

                TestManager.startTestSession(testId);

                return res.json({});
            })
            .catch((err: Error) => next(err))
    }

   public static stopTest(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        let testId = this.matchTestId(req);

        Test.update({ _id: testId }, { running: false }).exec()
            .then(() => {
                return res.json({});
            })
            .catch((err: Error) => next(err))
    }
}