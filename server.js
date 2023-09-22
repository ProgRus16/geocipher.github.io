/* const io = require('socket.io')(9705);
var cors = require('cors')

io.use(cors())

io.sockets.on('connection', (socket) => {
    console.log("connected!");

    socket.on("message", (msg)=>{
      console.log(msg);
      socket.broadcast.emit("message", msg)
    })
}) */

const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server, {
  cors: { origin: true, credentials: true}, allowEIO3: true 
});
// Обработчик подключения клиента
io.on('connection', (socket) => {
  console.log('Новый клиент подключился!');
  // Пример отправки JSON на клиент при подключении
  const data = {
    message: 'Привет, мир!',
    value: 42
  };
  socket.emit('json', JSON.stringify(data));
  // Обработчик получения данных от клиента
  socket.on('json', (json) => {
    console.log('Получен JSON:', json);
    // Дополнительная обработка полученного JSON
    // Пример отправки ответа клиенту
    const response = {
      status: 'success',
      message: 'Данные успешно обработаны'
    };
    socket.emit('response', JSON.stringify(response));
  });
  // Обработчик отключения клиента
  socket.on('disconnect', () => {
    console.log('Клиент отключился');
  });
});
// Запуск сервера на порту 3000
server.listen(1605, () => {
  console.log('Сервер запущен на порту 1605');
});