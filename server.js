const mqtt = require('mqtt')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
app.use(express.static('public'));

const options = {
    port: 1883,
    host: 'broker.mqttdashboard.com',
    clientId: 'clientId-gAe5UTm3Ou',
    username: 'lad',
    password: '123456',
}
const client = mqtt.connect(options);
client.on('connect', () => {
    console.log('MQTT connected!!');
});
const sensors = 'sensorlad'
const led1 = 'LED11'
const led2 = 'LED21'
client.subscribe(sensors, () => {
    client.on('message', (topic, message, packet) => {
        console.log(message.toString());
        io.sockets.emit('updateSensor', message.toString().split(' '))
        insertTB(`'${topic}', ${message.toString().split(' ')}`);
    });
});
io.on('connection', socket => {
    console.log(`user ${socket.id} connected`)
});

io.on('connection', socket => {
    socket.on('led1', msg => {
        io.sockets.emit('led1', msg);
        msg === 'on' && client.publish(led1, msg)
        msg === 'off' && client.publish(led1, msg)
    });
    socket.on('led2', msg => {
        io.sockets.emit('led2', msg);
        msg === 'on' && client.publish(led2, msg)
        msg === 'off' && client.publish(led2, msg)
    })
})

server.listen(3001, () => {
    console.log('listening on *:3001')
});

//Khai báo module
var mysql = require('mysql');

//Định nghĩa tham số CSDL
const db_config = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lad",
})  

db_config.connect(err => {
    if (err) throw err;
    console.log('Connected!');
    const sqlCreateTB = `CREATE TABLE lad (
        ID int(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        topic char(50),
        temp int(10),
        hum int(10),
        light int(10),
        currentTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`;
    db_config.query(sqlCreateTB, function (err, result) {
        if (err) throw err;
        console.log('Table created');
    });
});

function insertTB(msg) {
    const sqlInsert = `INSERT INTO lad (topic, temp, hum, light) VALUES (${msg})`;
    db_config.query(sqlInsert, (err, results) => {
        if (err) throw err;
        console.log("Insert sensor data successfull!");
    });
}
