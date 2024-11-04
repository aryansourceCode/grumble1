const socket = io();
const clienttotal = document.getElementById("clienttotal");
const container = document.getElementById("message-container");
const name = document.getElementById("name-input");
const messageinput = document.getElementById("message-input");
const messageform = document.getElementById("send-message");
const audio = new Audio('/chin.mp3');
const startButton = document.getElementById("start-button");

// Event listener for message form submission
messageform.addEventListener("submit", (e) => {
    e.preventDefault();
    sendmessage();
    clearmsg();
});

// Socket event listener for total clients update
socket.on("total-client", (data) => {
    clienttotal.innerText = `The number of people connected are ${data}`;
});

// Function to send a message
function sendmessage() {
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

// Socket event listener for new chat messages
socket.on("chat-msg", (data) => {
    audio.play();
    msgui(false, data);
});

// Function to update the message UI
function msgui(isownmsg, data) {
    clearmsg();
    const element = `<li class="${isownmsg ? 'message-right' : 'message-left'}">
                        <p class="message">
                            ${data.message} <span>${data.name}@${data.datetime}</span>
                        </p>
                     </li>`;
    container.innerHTML += element;
    scrolltobottom();
}

// Function to scroll to the bottom of the message container
function scrolltobottom() {
    container.scrollTo(0, container.scrollHeight);
}

// Event listeners for feedback
messageinput.addEventListener('focus', () => {
    socket.emit('feedback', {
        feedback: `${name.value} is typing`
    });
});

messageinput.addEventListener('keypress', () => {
    socket.emit('feedback', {
        feedback: `${name.value} is typing`
    });
});

messageinput.addEventListener('blur', () => {
    socket.emit('feedback', {
        feedback: ''
    });
});

// Socket event listener for feedback
socket.on('feedback', (data) => {
    if (data.feedback) {
        let feedbackElement = document.getElementById('feedback');
        if (!feedbackElement) {
            feedbackElement = document.createElement('li');
            feedbackElement.className = 'message-feedback';
            feedbackElement.id = 'feedback';
            container.appendChild(feedbackElement);
        }
        feedbackElement.innerHTML = `<p class="feedback">${data.feedback}</p>`;
    }
});

// Function to clear feedback messages
function clearmsg() {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element);
    });
}

// Speech to Text feature
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.interimResults = true;

startButton.addEventListener('click', () => {
    recognition.start();
});

recognition.addEventListener('result', (event) => {
    const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
    messageinput.value = transcript;
});
