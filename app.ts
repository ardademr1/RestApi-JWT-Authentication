import server from './server';

const port = parseInt(process.env.PORT || '3000');

//Uygulama Başlatıcı (nesne oluşturma)
const starter = new server().start(port)
  .then(port => console.log(`Server Çalışıyor... port= ${port}`))
  .catch(error => {
    console.log(error)
});


export default starter;


