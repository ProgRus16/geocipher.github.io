//const socket = io('ws://192.168.1.209:1605');
var test = [];
socket.on('connect', () => {
    console.log('Подключено к серверу');
});

enter_input_get_onclick = function () {
    function handleFormSubmit(event) {
        // Просим форму не отправлять данные самостоятельно
        event.preventDefault();
        lgn = document.getElementById('input_login_get').value;
        pswrd = document.getElementById('input_password_get').value;
    }
    handleFormSubmit(event);

    const sendData = {
        login: lgn,
        password: pswrd,
        transp: "get"
    };

    socket.emit('json', JSON.stringify(sendData));
}

socket.on('response', (json) => {
    console.log('Получен JSON:', json);

    ymaps.ready(init(json = json));

    function init(json) {
        var geolocation = ymaps.geolocation,
            map_get = new ymaps.Map('map_get', {
                center: [55.0415, 82.9346],
                zoom: 10
            }, {
                searchControlProvider: 'yandex#search'
            });
        // Сравним положение, вычисленное по ip пользователя и
        // положение, вычисленное средствами браузера.
        var readedMessages = []
        geolocation.get({
            provider: 'browser',
            mapStateAutoApply: true
        }).then(function (result) {
            // Синим цветом пометим положение, полученное через браузер.
            // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
            result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
            map_get.geoObjects.add(result.geoObjects);
            crds = result.geoObjects.position
            var readedMessages = []
            var x = 0;
            for (let i = 0; i < json.length; i++) {
                x++;
                //var circle = createCircle(json[i].coordinates.coords, parseInt(json[i].coordinates.radius));

                //map_get.geoObjects.add(circle);
                //circle.options.setParent(map_get.options);
                // Создаем экземпляр класса геометрии круга (указываем координаты и радиус в метрах).
                var circleGeometry = new ymaps.geometry.Circle(JSON.parse(json[i].coords), parseInt(json[i].radius)),
                    // Создаем экземпляр класса геообъекта и передаем нашу геометрию в конструктор.
                    circleGeoObject = new ymaps.GeoObject({
                        geometry: circleGeometry
                    });
                circleGeometry.setMap(map_get);
                circleGeometry.options.setParent(map_get.options);
                console.log(circleGeometry.contains(crds))
                if (circleGeometry.contains(crds)) {
                    readedMessages.push(json[i])
                }
                //map_get.geoObjects.remove(circle);
                console.log(i)

            }
            //debugger;
            console.log("Список: " + readedMessages);
            console.log("json:" + json);
            x = 0;

            function outputMessage(x) {
                //debugger;

                if (JSON.stringify(CryptoJS.HmacSHA256(readedMessages[i].message, readedMessages[i].coords).words) == JSON.stringify(JSON.parse(json[i + x].mac_message).words)) {
                    console.log("Сообщение: " + readedMessages[i].message)

                    var newDiv = document.createElement("div");
                    //debugger;
                    newDiv.innerHTML = "Сообщение: " + Aes.Ctr.decrypt(readedMessages[i].message, JSON.parse(readedMessages[i].coords), 256);
                    document.querySelector('.message').appendChild(newDiv);
                }
            }
            for (i = 0; i < readedMessages.length; i++) {
                //debugger;
                if (readedMessages[i].id == json[i + x].id) {
                    outputMessage(x)
                } else {

                    while (readedMessages[i].id != json[i + x].id) {
                        //debugger;
                        x++
                        console.log(readedMessages[i].id);
                        console.log(json[i + x].id);
                    }
                    outputMessage(x)
                }


            };
            map_get.destroy();

            socket.emit('indexMessage', readedMessages);
        });

    }

});