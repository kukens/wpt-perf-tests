import TestResultController from '../controllers/TestResultController';
import * as express from 'express';

export default class TestResultsRoutes {

    public static router(): express.Router {
        let router = express.Router();

        router.get('/test-results/*', function (req: express.Request, res: express.Response, next: express.NextFunction) {
            TestResultController.getTestResults(req, res, next);
        });

        return router
    }
}