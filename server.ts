
import Express from 'express';
const {pool} = require("./dbConfig");
import errorMiddleware from './middleware/error.middleware';
import { Client } from 'pg';
import HttpException from "./exceptions/HttpException";


class Server {
    private app: Express.Application;

    constructor() { //nesne oluşturulduğunda çağrılan metot
        this.app = Express();
        this.config();
        this.routerConfig();
        this.dbConnect();
    }

    private config() {
        this.app.use(Express.json());
        this.app.use(Express.urlencoded({extended: false}));
    }

    private dbConnect() {
        pool.connect(function (err: Error, client:Client, done) {
          if (err) {
            return console.error('Veri Tabanı Hatası', err.stack)
          }
            console.log('Veri Tabanına Bağlanıldı.');
          }); 
    }

    private routerConfig() {
      require('./routes/routeManager')(this.app);
    }
    
    private initializeErrorHandling() {
      this.app.use(errorMiddleware);
    }

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err: Object) => reject(err));
        });
    }
}

export default Server;

