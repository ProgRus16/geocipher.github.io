ymaps.ready(init)
function init() {
    var geolocation = ymaps.geolocation,
        mapGET = new ymaps.Map('map_get', {
            center: [ 55.0415, 82.9346],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });
    geolocation.get({
        provider: 'browser',
        mapStateAutoApply: false
    }).then(function (result) {
        console.log(result.geoObjects.position)
        // Синим цветом пометим положение, полученное через браузер.
        // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
        result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
        mapGET.geoObjects.add(result.geoObjects);
                

// Создаем круг.
var circle = new ymaps.Circle([
    // Координаты центра круга.
    result.geoObjects.position,
    // Радиус круга в метрах.
    100
], {
    // Описываем свойства круга.
    // Содержимое балуна.
    balloonContent: "Радиус круга - 100 м",
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

// Добавляем круг на карту.
mapGET.geoObjects.add(circle);
});
}