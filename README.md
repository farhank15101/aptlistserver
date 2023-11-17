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






