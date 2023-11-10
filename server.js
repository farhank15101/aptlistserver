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

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS installed_packages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      package_name VARCHAR(255) NOT NULL,
      distribution VARCHAR(50),
      status VARCHAR(20),
      version VARCHAR(50),
      architecture VARCHAR(20),
      installed_manually BOOLEAN NOT NULL,
      installed_automatically BOOLEAN NOT NULL,
      installed_locally BOOLEAN NOT NULL,
      CONSTRAINT unique_package UNIQUE (package_name, version, architecture)
    )
  `;


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
  INSERT INTO installed_packages (package_name, distribution, status, version, architecture,installed_manually, installed_automatically,installed_locally)
  VALUES (?,?,?,?,?,?,?,?);
`;

const packagesData = strAptInstalled.split('\n')
  .filter(line => line.trim() !== '')
  .map(line => {
  
    const [packageName, distribution, status, version, architecture,installed] = line.split(/[\/,\s]+/);

    const installedManually = installed.includes('installed')&&!installed.includes('automatic')&&!installed.includes('local');
    const installedAutomatically = installed.includes('automatic');
    const installedLocally = installed.includes('local');

    return [packageName, distribution, status, version, architecture, installedManually, installedAutomatically, installedLocally];
  });


connection.query(insertDataQuery, packagesData, (err, results) => {
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