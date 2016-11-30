import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as swig from 'swig';
import * as compression from 'compression';
import * as mongoose from 'mongoose';
import dbConfig from './config/dbConfig';

import indexRoutes from './routes/index'
import testResultsRoutes from './routes/testResults'
import testsRoutes from './routes/tests'
import TestManager from './models/TestManager'

export class App{

    constructor() {
        this.app = express();
        mongoose.connect(dbConfig.url);
        // view engine setup
        this.app.engine('html', swig.renderFile);
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'html');
        this.app.use(compression());
        // uncomment after placing your favicon in /public
        //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, 'global')));

        this.app.use('/', indexRoutes.router());
        this.app.use('/', testResultsRoutes.router());
        this.app.use('/', testsRoutes.router());


        TestManager.initTestSessions();

        // catch 404 and forward to error handler
        this.app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
            var err = new Error('Not Found');
            //err.status = 404;
            next(err);
        });

        // error handlers

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
                res.status(res.statusCode || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        this.app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
            res.status(res.statusCode || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    }


    public static init(): App {
        return new App();
    }

    public app: express.Application;
}


