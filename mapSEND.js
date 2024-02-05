ymaps.ready(init);
var coords;

function init() {
    var myPlacemark
    var mapSEND = new ymaps.Map("map", {
        center: [55.0415, 82.9346],
        zoom: 9,
        controls: ['zoomControl', 'searchControl', 'fullscreenControl']
    }, {
        searchControlProvider: 'yandex#search',
        suppressMapOpenBlock: true
    });



    // Слушаем клик на карте.
    mapSEND.events.add('click', function (e) {
        coords = e.get('coords');

        // Если метка уже создана – просто передвигаем ее.
        if (myPlacemark) {
            myCircle.geometry.setRadius(radius = document.getElementById('input_radius').value)
            myCircle.geometry.setCoordinates(coords)
            myPlacemark.geometry.setCoordinates(coords);

        }
        // Если нет – создаем.
        else {
            myCircle = createCircle(coords, radius = document.getElementById('input_radius').value)
            myPlacemark = createPlacemark(coords);
            console.log(myCircle)
            console.log(myPlacemark)
            mapSEND.geoObjects.add(myCircle).add(myPlacemark)

            // Слушаем событие окончания перетаскивания на метке.
            myPlacemark.events.add('dragend', function () {
                getAddress(myPlacemark.geometry.getCoordinates());
            });
        }
        getAddress(coords);
        return coords
    });

    // Создание метки.
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            iconCaption: 'поиск...'
        }, {
            preset: 'islands#violetDotIconWithCaption',
            draggable: false
        });
    }

    function createCircle(coords, radius = document.getElementById('input_radius').value) {
        console.log(radius)
        return new ymaps.Circle([
            // Координаты центра круга.
            coords,
            // Радиус круга в метрах.
            radius
        ], {
            // Описываем свойства круга.
            // Содержимое балуна.
            balloonContent: `Радиус круга - ${radius} м`,
            // Содержимое хинта.
            hintContent: "Радиус адреса"
        }, {
            // Задаем опции круга.
            // Включаем возможность перетаскивания круга.
            draggable: false,
            // Цвет заливки.
            // Последний байт (77) определяет прозрачность.
            // Прозрачность заливки также можно задать используя опцию "fillOpacity".
            fillColor: "#DB709377",
            // Цвет обводки.
            strokeColor: "#990066",
            // Прозрачность обводки.
            strokeOpacity: 0.8,
            // Ширина обводки в пикселях.
            strokeWidth: 5
        });

    }
    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        myPlacemark.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);

            myPlacemark.properties
                .set({
                    // Формируем строку с данными об объекте.
                    iconCaption: [
                        // Название населенного пункта или вышестоящее административно-территориальное образование.
                        firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                        // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                    ].filter(Boolean).join(', '),
                    // В качестве контента балуна задаем строку с адресом объекта.
                    balloonContent: firstGeoObject.getAddressLine()
                });
        });
    }


}