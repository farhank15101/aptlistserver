# aptlistserver


Prequisites: node.js is installed

Create the front-end react application: 

npx create-react-app client

Create the back-end server and install the required dependencies:

mkdir server

cd server
npm init -y
npm install express cors
npm install nodemon --save-dev

add this to package.json:

"scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
}

Then create a new file named server.js in the server folder

To run the back-end server: npm run dev


Install and set up MySQL:

sudo apt update
sudo apt install mysql-server

sudo mysql
alter user 'root'@'localhost' identified with mysql_native_password by "yourpassword";
exit

mysql_secure_installation

Note: dont change password of the root

mysql -u root -p

Then enter your password

create database:

create database exampleDatabase;

To see all created databases:

show schemas;

Create a new user instead of using root:

create user 'exampleuser'@'localhost' identified with mysql_native_password by "yournewpassword";

Grant database privledges to new user:

grant all on exampleDatabase.* to 'exampleuser'@'localhost';

Now to access MySQL using node.js:

npm install mysql 








