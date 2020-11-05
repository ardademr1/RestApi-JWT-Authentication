import {Request,Response,NextFunction,Router} from "express";
const router = Router();
const {generateAccessToken,generateRefreshToken,verifyToken} = require('../middleware/verifyToken');
let ctrlRegister = require('../controller/registerController');
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
          //res.render("register",{errors});
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
                    (err, results) => {
                      if (err) {
                        throw err;
                      }
                      console.log(results.rows);
                      console.log(results.id);
                      const user = ({
                        id: results.id, 
                        name: name,
                        email: email,
                        password: hashedPassword

                      });
                      const accessToken=generateAccessToken(user);//user koy
                      const refreshToken=generateRefreshToken(user);
                      return res.send({user: results.rows,message: "Kayıt Başarılı.",accessToken: accessToken,refreshToken: refreshToken});
                    }
                  );
                }
              }
          );

      }
  });


module.exports = router;