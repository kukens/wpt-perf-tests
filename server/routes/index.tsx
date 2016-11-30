import * as express from 'express';

export default class IndexRoutes {

    public static router(): express.Router
    {
        let router = express.Router();

        router.get('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
            res.render('index');
        });

        return router
    }
}