// interfaces.ts
  interface IUser {
    id: string,
    email: string,
    name: string,
    password: string
  }
  
  interface IToken {
    email: string,
    exp: number,
    iat: number,
    id: string,
    name: string,
    password: string 
  }
  declare global{
      namespace Express{
          interface Request{
              tokenUser: IToken;
              User: IUser;
          }
      }
  }
  export {
    // not exporting IWords | INumbers
    IUser,
    IToken,
  }