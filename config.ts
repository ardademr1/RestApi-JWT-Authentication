import * as dotenv from 'dotenv';
dotenv.config();

class Config{
    // Application port
    public NODE_ENV = process.env.NODE_ENV || 'development';
    public PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

    // Secret passport
    public secret = process.env.SECRET_SESSION || 'secretidhere'; 

    constructor(){
        console.log("Config Class");
    }
}

export default new Config();