import TestController from '../controllers/TestController';
import * as express from 'express';

export default class TestsRoutes {

    public static router(): express.Router {
        let router = express.Router();

        router.get('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
            res.render('index');
        });
        
        router.get('/tests', function (req: express.Request, res: express.Response, next: express.NextFunction) {
            TestController.getTests(req, res, next);
        });

        router.get('/tests/*', function (req: express.Request, res: express.Response, next: express.NextFunction) {
            TestController.getTest(req, res, next);
        });

        router.put('/tests/*', function (req: express.Request, res: express.Response, next: express.NextFunction) {
            TestController.editTest(req, res, next);
        });

        router.delete('/tests/*/session', function (req: express.Request, res: express.Response, next: express.NextFunction) {
            TestController.stopTest(req, res, next);
        });

        router.post('/tests/*/session', function (req: express.Request, res: express.Response, next: express.NextFunction) {
            TestController.startTest(req, res, next);
        });

        router.post('/tests', function (req: express.Request, res: express.Response, next: express.NextFunction) {
            TestController.addTest(req, res, next);
        });

        router.delete('/tests/*', function (req: express.Request, res: express.Response, next: express.NextFunction) {
            TestController.deleteTest(req, res, next);
        });

        return router
    }
}