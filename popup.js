let startButton = document.getElementById("start");
let stopButton = document.getElementById("stop");
let clearButton = document.getElementById("clear");
let eventsList = document.getElementById("events");

startButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
clearButton.addEventListener("click", clearEvents);

function startRecording() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "startRecording" });
    });
}

function stopRecording() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "stopRecording" });
    });
}

function clearEvents() {
    chrome.runtime.sendMessage({ action: "clearEvents" }, function(response) {
        if (response.success) {
            eventsList.innerHTML = "";
        }
    });
}

function renderEvents(events) {
    eventsList.innerHTML = "";
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        let listItem = document.createElement("li");
        listItem.textContent = event.type + ": ";
        if (event.type === "click") {
            listItem.textContent += event.element.tagName + "." + event.element.className;
            let screenshot = document.createElement("img");
            screenshot.src = "https://api.screenshotmachine.com?key=YOUR_API_KEY&url=" + encodeURIComponent(window.location.href) + "&device=desktop&dimension=1024x768&cacheLimit=0&delay=2000&element=" + encodeURIComponent(event.element.tagName + "." + event.element.className) + "&format=png";
            screenshot.width = 200;
            listItem.appendChild(screenshot);
        } else if (event.type === "keydown") {
            listItem.textContent += event.key;
        }
        eventsList.appendChild(listItem);
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "updateEvents") {
        renderEvents(request.events);
    }
});

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {


    console.log(tabs);

    // chrome.tabs.sendMessage(tabs[0].id, { action: "getEvents" }, function(response) {
    //     if (response.events) {
    //         renderEvents(response.events);
    //     }
    // });
});
