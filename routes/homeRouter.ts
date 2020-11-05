import Express,{Request,Response,NextFunction,Router} from "express";
const router = Router();
import Hashids from 'hashids';
const hashids = new Hashids(process.env.HASHIDS_SALT);
const {pool} = require("../dbConfig");


let ctrlHome = require('../controller/homeController');


router.route("/")
      .get(ctrlHome.index).post();

      // veri tabanından kullanıcı silme
      router.delete("/users/delete/:id",async(req: Express.Request,res: Express.Response)=>{
            const hid = hashids.decode(req.params.id)
            const id=hid[0];
            console.log(id);
            
            await pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
              if (error) {
                return res.status(400).send({ message: "Hata oluştu! ",error });
              }
              res.status(200).send(`Kullanıcı Silindi! ID: ${id}`)
            })
          });
  
          // veri tabanındaki mevcut bir kullanıcının verilerini güncellenme
          router.put("/users/update/:id",(req: Express.Request,res: Express.Response)=>{
            const hid = hashids.decode(req.params.id)
            const id=hid[0];
            const { name, email } = req.body
            pool.query(
              `SELECT * FROM users
                WHERE email = $1 AND id != $2`,
              [email,id],
              (err, results) => {
                if (err) {
                  throw err;
                }
                //console.log(results.rows);
                if (results.rows.length > 0) {
                  return res.status(400).send({
                    message: "Email Çoktan Alınmış."
                  });
                } else {
                    pool.query(
                      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
                      [name, email, id],
                      (error, results) => {
                        if (error) {
                          return res.status(400).send({ message: "Hata oluştu! ",error });
                        }
                        res.status(200).send(`User modified with ID: ${id}`)
                      }
                    );
                  }
              }
          );
                  
          });
  
          // veri tabanından bütün kullanıcıları görmek
          router.get("/users/list",(req: Express.Request,res: Express.Response)=>{
              pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
                if (error) {
                  throw error
                }
                res.status(200).json(results.rows)
              })
            
          });
  

module.exports = router