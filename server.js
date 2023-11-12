const express = require('express');
const app = express();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'example',
  password: 'Password123.',
  database: 'package_info',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  else{
    console.log('Connected to MySQL as id ' + connection.threadId);

  }
});


function hexToUtf8(hex) {
  var bytes = hex.match(/.{2}/g);
  var utf8 = '';
  for (var i = 0; i < bytes.length; i++) {
    utf8 += String.fromCharCode(parseInt(bytes[i], 16));
  }

  return utf8;
}

const child_process = require('child_process');
const output = child_process.execSync('apt list --installed');
const byteBufferAptInstalled = output.toString('hex');

var strAptInstalled = hexToUtf8(byteBufferAptInstalled);

var splitApp=strAptInstalled.split('\n');

const twoDArray = splitApp.map(item => item.replace(/,(?=now)/, ' ').split(/[\/\s]+/));

const filteredArray = twoDArray.filter(item => item.length === 5 || item.length===6||item.length==7);


const newArray=filteredArray.map(item => {
  if (item.length === 5) {

    return [item[0], null, ...item.slice(1)]; 
  }
  else if(item.length==7){
    const fusedElements=item.slice(-3);
    const fusedString=fusedElements.join(' ');
    item.splice(-3,3,fusedString);
    return [item[0],null,...item.slice(1)];

  } 
  else {
    return item; 
  }
});



const createTableQuery = `
    CREATE TABLE IF NOT EXISTS installed_packages_info_edited (
      id INT AUTO_INCREMENT PRIMARY KEY,
      package_name VARCHAR(255) NOT NULL,
      distribution TEXT,
      status VARCHAR(50),
      version VARCHAR(50),
      architecture VARCHAR(50),
      installation_info VARCHAR(50),
      CONSTRAINT unique_package UNIQUE (package_name, version, architecture)
    )`;


connection.query(createTableQuery, (err) => {
  if (err) {
    console.error('Error creating table: ' + err.stack);
    return;
  }
  else {
    console.log('Table created or already exists');
  }
  });

const insertDataQuery = `
  INSERT INTO installed_packages_info_edited (package_name, distribution, status, version, architecture,installation_info)
  VALUES ?
`;



connection.query(insertDataQuery, [newArray] ,(err, results) => {
  if (err) {
    console.error('Error inserting data: ' + err.stack);
    return;
    }
  else{
    console.log('Data inserted into the table');
  }
    
  });
   
//console.log(strAptInstalled); 

app.get('/', (req, res) => {
  res.send(strAptInstalled);
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});