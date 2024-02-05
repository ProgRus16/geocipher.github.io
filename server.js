const http = require('http');
var CryptoJS = require("crypto-js");

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('C:/sqlite/SQLiteStudio/db');


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

    console.log('Новый клиент подключился!');
    var json_var;
    // Обработчик получения данных от клиента
    socket.on('json', (json) => {
        console.log('Получен JSON:', json);
        // Дополнительная обработка полученного JSON
        // Пример отправки ответа клиенту
        console.log(JSON.parse(json)['transp'])
        if (JSON.parse(json)['transp'] == "send") {
            console.log("send");
            json_var = JSON.parse(json);
            console.log(json_var);
            console.log(json_var.message.mac.words)




            query = `SELECT * FROM messages`;
            db.all(query, [], (err, rows) => {
                if (err) {
                    throw err;
                }
                db.run(`INSERT INTO messages(message, mac_message, login, password, coords, radius) VALUES(?, ?, ?, ?, ?, ?)`, [json_var.message.msg, JSON.stringify(json_var.message.mac), json_var.login, json_var.password, JSON.stringify(json_var.coordinates.coords), json_var.coordinates.radius], function (err) {
                    if (err) {
                        return console.log(err.message);
                    }
                    // get the last insert id
                    console.log(`A row has been inserted with rowid ${this.lastID}`);
                });
            });

            /* 
                        fs.readFile("messages.txt", function (error, data) {
                            if (data.toString() == '') { // если возникла ошибка
                                fs.open('messages.txt', 'w', (err) => {
                                    if (err) throw err;
                                    console.log('File created');
                                    messagesJSON = {
                                        'messages': []
                                    };
                                    console.log(messagesJSON)
                                    messagesJSON.messages.push(json_var);
                                    console.log(messagesJSON)
                                    fs.appendFile('messages.txt', JSON.stringify(messagesJSON), (err) => {
                                        if (err) throw err;
                                    })
                                });
                            } else {
                                //messagesJSON = JSON.parse(data.toString());
                                //console.log(messagesJSON)
                                //messagesJSON.messages.push(json_var);
                                //console.log(messagesJSON);
                                //writeFile();
                                fs.truncate('messages.txt', err => {
                                    if (err) throw err; // не удалось очистить файл
                                    console.log('Файл успешно очищен');
                                });
                                fs.appendFile('messages.txt', JSON.stringify(messagesJSON), (err) => {
                                    console.log('Data has been added!');
                                });
                            }

                        }); */


        } else {
            console.log("get");



            json_var = JSON.parse(json);
            console.log(json_var.password)
            const query = `SELECT * FROM messages WHERE login=? AND password=?`;
            db.all(query, [json_var['login'], json_var['password']], (err, rows) => {
                if (err) {
                    throw err;
                }
                console.log(rows);
                /*const allJSON = rows.map(row => ({
                    message: {
                        msg: row.message,
                        mac: JSON.parse(row.mac_message)
                    },
                    coordinates: {
                        coords: JSON.parse(row.coords),
                        radius: row.radius
                    },
                    login: row.login,
                    password: row.password
                }));
                console.log(allJSON)
                // Вывод JSON объекта

                function filterJSON(jsonArray, key1, value1, key2, value2) {
                    return jsonArray.filter(item => item[key1] === value1 && item[key2] === value2);
                }
                responseJSON = filterJSON(allJSON, 'login', json_var['login'], 'password', json_var.password)*/
                socket.emit('response', rows);
            });

            // Выводим JSON в консоль
            /* fs.readFile("messages.txt", function (error, data) {
                if (error) { // если возникла ошибка
                    responseJSON = "Ошибка";
                } else {
                    allJSON = JSON.parse(data.toString());
                    //console.log(json_var['login']) */






            //console.log(responseJSON); // выводим считанные данные






        }

    });

    socket.on('indexMessage', function (indexMessage) {
        console.log('On indexMessage');
        console.log(indexMessage);

        indexMessage.forEach(element => {
            db.run(`DELETE FROM messages WHERE ID=?`, [element.id], function () {
                console.log('Сообщение удалено id=' + element.id)
            });
        });

        //allJSON.messages.splice(indexMessage, 1);
        //console.log(allJSON);

        //fs.writeFile('messages.txt', JSON.stringify(allJSON), function () {});
        //fs.truncateSync('messages.txt');
        //fs.appendFileSync('messages.txt', allJSON);
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