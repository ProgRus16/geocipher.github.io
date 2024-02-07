const socket = io.connect('ws://192.168.1.209:1605', {
    disconnect: false
});

enter_input_send_onclick = function () {
    if (coords != undefined) {
        function handleFormSubmit(event) {
            // Просим форму не отправлять данные самостоятельно
            event.preventDefault();
            radius = document.getElementById('input_radius').value

            pswrd = document.getElementById('input_password_send').value
            msg = Aes.Ctr.encrypt(document.getElementById('input_message').value, coords, 256);
            lgn = document.getElementById('input_login_send').value
            mac = CryptoJS.HmacSHA256(msg, JSON.stringify(coords))
            /* dt = document.getElementById('date').value
            tm = document.getElementById('time').value */
        }

        handleFormSubmit(event);

        if (msg != "") {
            /*  if (dt != "" && tm != "") {
                 if (dateVar.getFullYear()) { }
             }
             else { } */
            // Обработчик события подключения к серверу
            //socket.connect("/", { disconnect: false, secure: true, transports: ["flashsocket", "polling", "websocket"] });

            console.log('Подключено к серверу');
            // Пример отправки JSON на сервер
            //var dateVar = new Date();
            const sendData = {
                message: {
                    msg,
                    mac
                },
                coordinates: {
                    coords,
                    radius
                },
                login: lgn,
                password: pswrd,
                /* datetime: {
                    start: {
                        date: `${dateVar.getFullYear()}-${dateVar.getMonth() + 1}-${dateVar.getDate() - 1}`,
                        time: {
                            hours: dateVar.getUTCHours(),
                            minutes: dateVar.getUTCMinutes()
                        }
                    },
                    finish: { date: dt, time: { hours: tm.slice(0, 2), minutes: tm.slice(3, 6) } }
                }, */
                transp: "send"
            };
            console.log(coords)
            socket.emit('json', JSON.stringify(sendData));

            // Обработчик события отключения от сервера
            /*socket.on('disconnect', () => {
                console.log('Отключено от сервера');
                return false;
            });*/
        } else {
            alert("Заполните все поля")
        }
    } else {
        alert("Укажите координаты")
    }

}
