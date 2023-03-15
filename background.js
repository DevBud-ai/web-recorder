
// Websocket connection
// var socket = new WebSocket('ws://localhost:8080/ws');
// socket.binaryType = "arraybuffer";
// socket.bufferedAmount = 8192;
//
// socket.onopen = function(event) {
//     console.log("WebSocket connection opened");
// }
//
// socket.onmessage = function(event) {
//     console.log("WebSocket message received: ", event.data);
// }
//
// socket.onclose = function(event) {
//     console.log("WebSocket connection closed");
// }


// Using Fetch
const sendViaPost = (payload) => {

    fetch('http://localhost:8080/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(response => {
        console.log('Response:', response);
    });

}


chrome.webNavigation.onCommitted.addListener(function(details) {
    if (details.transitionType === 'auto_subframe') {
        // Ignore subframes within the page
        return;
    }

    // Log the URL of the page that the user navigated to
    console.log('Navigated to:', details.url);
    const payload = {
        type: 'visit',
        timestamp: new Date().getTime(),
        data:{
            action: 'visit',
            url: details.url,
            timestamp: new Date().getTime()
        }
    }
    sendViaPost(payload);
    //socket.send(JSON.stringify(payload));

});

// chrome.action.onClicked.addListener(function(tab) {
//     // Do something when the extension icon is clicked
//     console.log("Extension icon clicked!");
// });

chrome.tabs.onCreated.addListener(function(tab) {
    // Log the URL of the new tab that was created
    console.log('New tab opened:', tab.url);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // Log the URL of the tab that was updated
    console.log('Tab updated:', tab.url);

    if (changeInfo.status == 'complete') {
        chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(dataUrl) {
            // Do something with the data URL
            console.log('Screenshot captured:', dataUrl);

            const payload = {
                type: 'screenshot',
                timestamp: new Date().getTime(),
                data:{
                    action: 'screenshot',
                    url: tab.url,
                    image: dataUrl
                }
            }
            sendViaPost(payload);
            //socket.send(JSON.stringify(payload));
        });
    }



});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    console.log('Tab switched:', activeInfo.tabId);
    console.log('Window switched:', activeInfo.windowId);
});

// Let's record user clicks



// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     console.log('Received message:', message);
//     sendResponse({damn: true});
// });


chrome.runtime.onConnect.addListener((port) => {
    console.log("connected ", port.name);


    port.onMessage.addListener(async (msg) => {
        console.log("received msg", msg);
        //if (msg.type === 'click') {
            console.log("clicked", msg.data);
            msg.timestamp = new Date().getTime()
            sendViaPost(msg);
            //socket.send(JSON.stringify(msg));

            // var targetElement = document.evaluate('/html/body/div[4]/div[2]/div/div/div/div[3]/div/span[2]/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            //
            // // Takescreenshots
            // var rect = targetElement.getBoundingClientRect();
           // console.log("Target rect", rect);
       // }
    });

    return true
});