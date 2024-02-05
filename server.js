//The code was written by Dezhinov Maxim
const http = require('http');
var CryptoJS = require("crypto-js");

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('db');


const server = http.createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: true,
        credentials: true
    },
    allowEIO3: true
});


// Обработчик подключения клиента
io.on('connection', (socket) => {

    
    var json_var;
    // Обработчик получения данных от клиента
    socket.on('json', (json) => {
        
        // Дополнительная обработка полученного JSON
        // Пример отправки ответа клиенту
        
        if (JSON.parse(json)['transp'] == "send") {
            
            json_var = JSON.parse(json);
            

            query = `SELECT * FROM messages`;
            db.all(query, [], (err, rows) => {
                if (err) {
                    throw err;
                }
                db.run(`INSERT INTO messages(message, mac_message, login, password, coords, radius) VALUES(?, ?, ?, ?, ?, ?)`, [json_var.message.msg, JSON.stringify(json_var.message.mac), json_var.login, json_var.password, JSON.stringify(json_var.coordinates.coords), json_var.coordinates.radius], function (err) {
                    if (err) {
                        return console.log(err.message);
                    }
                    
                });
            });

        } else {
            



            json_var = JSON.parse(json);
            
            const query = `SELECT * FROM messages WHERE login=? AND password=?`;
            db.all(query, [json_var['login'], json_var['password']], (err, rows) => {
                if (err) {
                    throw err;
                }
                
                
                socket.emit('response', rows);
            });

        }

    });

    socket.on('indexMessage', function (indexMessage) {
        

        indexMessage.forEach(element => {
            db.run(`DELETE FROM messages WHERE ID=?`, [element.id], function () {
                console.log('Сообщение удалено id=' + element.id)
            });
        });

    });

    // Обработчик отключения клиента
    socket.on('disconnect', () => {
        console.log('Клиент отключился');
    });
});
// Запуск сервера на порту 1605
server.listen(1605, () => {
    console.log('Сервер запущен на порту 1605');
});
