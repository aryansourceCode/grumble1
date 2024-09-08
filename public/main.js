const socket = io();
const clienttotal = document.getElementById("clienttotal");
const container = document.getElementById("message-container");
const name = document.getElementById("name-input");
const messageinput = document.getElementById("message-input");
const messageform = document.getElementById("send-message");
const message = document.getElementById("message-container");
const audio=new Audio('/chin.mp3')
messageform.addEventListener("submit", (e) => {
    e.preventDefault();
    sendmessage();
    clearmsg()
});

socket.on("total-client", (data) => {
    console.log(clienttotal.innerText);
    console.log(data);
    clienttotal.innerText = `The number of people connected are ${data}`;
});

function sendmessage() {
    console.log(messageinput.value);
    if (messageinput.value === '') { return; }
    const data = {
        name: name.value,
        message: messageinput.value,
        datetime: new Date().toLocaleString(),
    };
    socket.emit("message", data);
    msgui(true, data);
    messageinput.value = "";
}

socket.on("chat-msg", (data) => {
    console.log(data);
    audio.play()
    msgui(false, data);
});

function msgui(isownmsg, data) {
    clearmsg()

    const element = `<li class="${isownmsg ? 'message-right' : 'message-left'}">
                        <p class="message">
                            ${data.message} <span>${data.name}@${data.datetime}</span>
                        </p>
                     </li>`;
    container.innerHTML += element;
    scrolltobottom();
}

function scrolltobottom() {
    container.scrollTo(0, container.scrollHeight);
}

messageinput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `${name.value} is typing`
    });
});

messageinput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `${name.value} is typing`
    });
});

messageinput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ''
    });
});
socket.on('feedback', (data) => {
    console.log(data);

   if (data.feedback) {
        // Check if feedback element already exists
        let feedbackElement = document.getElementById('feedback');
        
        if (!feedbackElement) {
            // Create feedback element if it doesn't exist
            feedbackElement = document.createElement('li');
            feedbackElement.className = 'message-feedback';
            feedbackElement.id = 'feedback';
            container.appendChild(feedbackElement);
        }

        // Update feedback content
        feedbackElement.innerHTML = `<p class="feedback">${data.feedback}</p>`;
    }

});

function clearmsg() {
    // Find the feedback element by id and remove it
    document.querySelectorAll('li.message-feedback').forEach(element=>{element.parentNode.removeChild(element)})
}
