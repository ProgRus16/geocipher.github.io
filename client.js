function handleFormSubmit(event) {
  // Просим форму не отправлять данные самостоятельно
  event.preventDefault()
  console.log('Отправка!')
}

const applicantForm = document.getElementById('msg_form')
applicantForm.addEventListener('submit', handleFormSubmit)


socket = io('ws://localhost:9705');

const coord = null;

const pack = (obj) =>{
    return JSON.stringify(obj);
}

socket.emit("message", pack({
    coord: "82/55",
    msg: msg
}))
