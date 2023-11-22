import { getResponse } from "./getAi.js"

const startBtn = document.getElementById("start-btn")
const stopBtn = document.getElementById("stop-btn")
const dialogContainerEl = document.getElementById("chat-container")

const dialogData = []
let isActive = false
let dialogEl

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const listener = new SpeechRecognition()
listener.interimResults = true
listener.continuous = false
listener.lang = "en-US"


listener.addEventListener('result', (e) => {
    handleResultEvent(e)
})

function handleResultEvent(event) {
    const request = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')

    dialogEl.innerText = request

    if(event.results[0].isFinal) {
        handleRequest(request)
    }
}

function handleRequest(request) {
    dialogData.push(request)
}

listener.addEventListener('end', () => {
    handleEndEvent()
})

function handleEndEvent() {
    if(!isActive) return

    if(dialogEl.innerText === '') {
        listener.start()
    } else {

        createResponseEl()
        getResponse(dialogData[dialogData.length -1], '')
            .then(res => handleResponse(res))

    }
}

function handleResponse(response) {
    dialogEl.innerText = response
    dialogData.push(response)

    console.log(listener)
    createRequestEl()
    listener.start()    
}

function createRequestEl() {
    dialogEl = document.createElement("p")
    dialogEl.className = 'chat-result chat-result-listener'
    dialogContainerEl.appendChild(dialogEl)
}

function createResponseEl() {
    dialogEl = document.createElement("p")
    dialogEl.className = 'chat-result chat-result-response'
    dialogContainerEl.appendChild(dialogEl)
}

startBtn.addEventListener('click', () => {
    toggleIsActive()
    createRequestEl()
    listener.start()    
})

stopBtn.addEventListener('click', () => {
    dialogContainerEl.innerHTML = ''
    toggleIsActive()
    listener.abort()
})

function toggleIsActive() {
    isActive = !isActive
    startBtn.style.display = isActive ? 'none' : 'block'
    stopBtn.style.display = isActive ? 'block' : 'none'
}

