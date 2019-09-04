import Path from 'path';
import Express, { Application, Request, Response } from 'express';
import cors from 'cors';
import BodyParser from 'body-parser';
import errorHandler from './middlewares/errorHandler';
import mongoDB from './apis/mongodb';
import withApi from './endpoints';

const { MAX_FILE_SIZE } = require('./config.json');

const { PORT } = process.env;

mongoDB();

const app: Application = Express();

app.disable('x-powered-by');
app.disable('etag');

app.use(Express.static(Path.resolve('./static')));

app.use(BodyParser.json());
app.use(BodyParser.raw({ type: 'audio/mpeg', limit: MAX_FILE_SIZE }));

app.use(cors());

app.use(errorHandler());

// app.get('/', (req: Request, res: Response) => {
//   res.sendFile(Path.resolve('./html/index.html'));
// });

withApi(app);

// app.get('*', (req: Request, res: Response) => {
//   res.redirect('/');
// });

app.listen(PORT);
