import {Request,Response,Router} from "express";
const router = Router();
const {generateAccessToken,generateRefreshToken} = require('../middleware/verifyToken');
import Hashids from 'hashids';
const hashids = new Hashids(process.env.HASHIDS_SALT);//salt
import { IUser } from '../interfaces';
//let ctrlRegister = require('../controller/registerController');
import bcrypt from 'bcrypt';
import {pool} from "../dbConfig";


router.get("/register", (req, res) => {
            res.render("register");
          });


//Veri tabanına Kayıt Eklemek
router.post('/registers',async (req:Request,res:Response)=>{
      const {name, email, password, password2} =req.body;

      console.log({
          name,
          email,
          password,
          password2
      });

      let errors=[];

      if(!name||!email||!password||!password2){
          res.status(400).send({message: "Tüm Alanları Doldurun"});
      }
      if(password.length <6){
        res.status(400).send({message: "Şifre 6 Karakterde Az Olamaz"});
      }
      if(password != password2){
        res.status(400).send({message: "Şifreler Farklı"});
      }
      if(errors.length>0){
          res.status(400).send({message: 'Kayıt Başarısız.'});
      }else{
          // kayıt olma başarılı
          let hashedPassword = await bcrypt.hash(password, 10);
          console.log(hashedPassword);

          pool.query(
              `SELECT * FROM users
                WHERE email = $1`,
              [email],
              (err, results) => {
                if (err) {
                  throw err;
                }
                console.log(results.rows);
                if (results.rows.length > 0) {
                  return res.status(400).send({
                    message: "Email Çoktan Alınmış."
                  });
                } else {
                  pool.query(
                    `INSERT INTO users (name, email, password)
                        VALUES ($1, $2, $3)
                        RETURNING id, password`,
                    [name, email, hashedPassword],
                    (err:Error, results) => {
                      if (err) {
                        throw err;
                      }
                      console.log(results.rows);
                      console.log(results.id);
                      const user:IUser = results.rows[0];
                      let hashedid = hashids.encode(user.id);
                      user.id=hashedid;
                      const user2:IUser = ({
                        id: user.id, 
                        name: name,
                        email: email,
                        password: hashedPassword

                      });
                      const accessToken=generateAccessToken(user2);//user koy
                      const refreshToken=generateRefreshToken(user2);
                      return res.send({user2,message: "Kayıt Başarılı.",accessToken: accessToken,refreshToken: refreshToken});
                    }
                  );
                }
              }
          );

      }
  });


module.exports = router;