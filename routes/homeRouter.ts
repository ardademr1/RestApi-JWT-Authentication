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
            const id=hid[0];  // hashed id yi sayıya çevirmek
            if(id==undefined){
              res.status(400).send({message:`Geçersiz Kullanıcı ID'si`}) 
            }
            pool.query(
              `SELECT * FROM users
                WHERE id = $1`,
              [id],
              (err:Error, results) => {
                if (err) {
                  throw err;
                }
                console.log(results.rows);
                if (results.rows.length > 0) {
                  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
                    if (error) {
                      return res.status(400).send({ message: "Hata oluştu! ",error });
                    }
                    res.status(200).send({message:`Kullanıcı Silindi! ID: ${id}`})
                  })
                }else{return res.status(400).send({ message: "Kullanıcı ID'si Bulunamadı!"});}
              }
          );
            
          });
  
          // veri tabanındaki mevcut bir kullanıcının verilerini güncellenme
          router.put("/users/update/:id",(req: Express.Request,res: Express.Response)=>{
            const hid = hashids.decode(req.params.id)
            const id=hid[0];
            const { name, email } = req.body
            pool.query(
              `SELECT * FROM users
                WHERE id = $1`,
              [id],
              (err:Error, results) => {
                if (err) {
                  throw err;
                }
                if (results.rows.length > 0) { //Kullanıcı Bulunur ise
                  pool.query(
                    `SELECT * FROM users
                      WHERE email = $1 AND id != $2`,
                    [email,id],
                    (err:Error, results) => {
                      if (err) {
                        throw err;
                      }
                      if (results.rows.length > 0) {
                        return res.status(400).send({
                          message: "Email Çoktan Alınmış."
                        });
                      } else {
                          pool.query(
                            'UPDATE users SET name = $1, email = $2 WHERE id = $3',
                            [name, email, id],
                            (error:Error, results) => {
                              if (error) {
                                throw error;
                              }
                              if(id==undefined){
                                res.status(400).send({message:`Kullanıcı ID si geçersiz`})  
                              }else{
                                res.status(200).send({message:`Kullanıcı Güncellendi! ID: ${id}`}) 
                              }
                            }
                          );
                        }
                    }
                );
                }
                else{
                  return res.status(400).send({
                    message: "Kullanıcı Bulunamadı!"
                  });
                }
              }
            );    
          });
  
          // veri tabanından  kullanıcıları görmek
          router.get("/users/list",(req: Express.Request,res: Express.Response)=>{
            const { page, limit } = req.body;
            let toplamUserSayisi:number;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const offset = (page - 1) * limit;
            
            pool.query(`SELECT * FROM users ORDER BY id ASC`, (error: Error, results) => {
              if (error) {
                res.status(400).send("Hata Oluştu!");
                console.log(error);
              }
              toplamUserSayisi=results.rows.length;
              pool.query(`SELECT * FROM users ORDER BY id ASC LIMIT ${limit} OFFSET ${offset}`, (error: Error, results) => {
                if (error) {
                  res.status(400).send("Hata Oluştu!");
                  console.log(error);
                }
                if(endIndex<toplamUserSayisi){//user sayısı son indexten büyükse
                  if(endIndex==limit*Math.floor(toplamUserSayisi/limit)){
                    results.next = {
                      page: page+1,
                      limit: toplamUserSayisi-limit*Math.floor(toplamUserSayisi/limit)
                    }
                  }else{
                    results.next = {
                      page: page+1,
                      limit: limit
                    }
                  }
                }
                if(startIndex>0){
                  results.previous={
                    page:page-1,
                    limit:limit
                  }
                }
                const sayfaSayisi = Math.ceil(toplamUserSayisi/limit);
                res.status(200).send({page:page,limit:limit,totalPage:sayfaSayisi,ViewingPage:`${page} of ${sayfaSayisi},`,result: results.rows,next:results.next,previous:results.previous})
              })
            })
          });


module.exports = router