# RestApi-JWT
## 🚀 Get Started

1. **Install dependencies.**

   ```sh
   # install the dependencies
   npm install 
   ```
2. **Setup docker and postgres.**
   
   ```sh
   # 1-docker image >> 
   $ docker pull postgres:alpine
   ```
   ```sh
   # 2-start a postgres >>
   $ docker run --name postgres-0 -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres:alpine
   ```
   ```sh
   # 3-get inside container >>
   $ docker exec -it postgres-0 psql -U postgres
   ```
   ```sh
   # 4-create database user >>
   postgres=# CREATE USER myname WITH PASSWORD 'password' CREATEDB
   
                                       List of roles
    Role name |                         Attributes                         | Member of
   -----------+------------------------------------------------------------+-----------
    myname    | Create DB                                                  | {}
    postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
   
   postgres=# \q
   ```
   ```sh
   # 5-connect to psql with user (myname) >>
   $ docker exec -it postgres-0 psql -U myname -d postgres
   ```
   ```sh
   # 6-create and connect db >>
   postgres=> CREATE DATABASE nodelogin
   CREATE DATABASE
   
   postgres=>\c nodelogin
   You are now connected to database "nodelogin" as user "myname".
   ```
   ```sh
   # 7-create table >>
   nodelogin=> CREATE TABLE users
   nodelogin-> (id BIGSERIAL PRIMARY KEY NOT NULL,
   nodelogin(> name VARCHAR(200) NOT NULL,
   nodelogin(> email VARCHAR(200) NOT NULL,
   nodelogin(> password VARCHAR(200) NOT NULL,
   nodelogin(> UNIQUE (email));
   
   # users table columns >>
    id | name | email | password
   ----+------+-------+-----------
   ```
3. **Setup .env and .dockerignore files.**

   ```sh
      # fill up .env file like this;
      DB_USER= myname
      DB_PASSWORD= password
      DB_HOST= 0.0.0.0
      DB_PORT= 5432
      DB_DATABASE= nodelogin
      # fill up .dockerignore file like this;
      node_modules
   ```
4. **Start developing.**

   ```sh
   # "start": "nodemon app.ts",
   npm run start
   ```
5. **Open the source code and start editing!**

   Your site is now running at `http://localhost:3000`!
   <br>Pages:
   `http://localhost:3000/users/login`<br>
   `http://localhost:3000/users/register`<br>
   `http://localhost:3000/users/dashboard`


   Console:
   ```sh
   Server Çalışıyor... port= 3000
   Veri Tabanına Bağlanıldı.
   ```

Docker-PostgreSQL-NodeJS-Express-TypeScript
