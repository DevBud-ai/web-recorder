// import html2canvas from "html2canvas";


function stringify_object(object, depth=0, max_depth=2) {
    // change max_depth to see more levels, for a touch event, 2 is good
    if (depth > max_depth)
        return 'Object';

    const obj = {};
    for (let key in object) {
        let value = object[key];
        if (value instanceof Node)
            // specify which properties you want to see from the node
            value = {id: value.id};
        else if (value instanceof Window)
            value = 'Window';
        else if (value instanceof Object)
            value = stringify_object(value, depth+1, max_depth);

        obj[key] = value;
    }

    return depth? obj: JSON.stringify(obj);
}

// XPATH
function getElementXPath(element) {
    const paths = [];

    // Use nodeName (instead of localName) so namespace prefix is included (if any).
    for (; element && element.nodeType == Node.ELEMENT_NODE; element = element.parentNode)  {
        let index = 0;
        for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
            // Ignore document type declaration.
            if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE) {
                continue;
            }
            if (sibling.nodeName == element.nodeName) {
                ++index;
            }
        }
        let tagName = element.nodeName.toLowerCase();
        let pathIndex = index ? `[${index + 1}]` : '';
        paths.splice(0, 0, `${tagName}${pathIndex}`);
    }

    return paths.length ? `/${paths.join('/')}` : null;
}

function getIDSelector(element) {
    if (element.id) {
        return '#' + element.id;
    }
    return null;
}

function getElementSelector(element) {
    if (element.classList.length > 0) {
        const classes = Array.from(element.classList).join('.');
        return element.tagName.toLowerCase() + '.' + classes;
    }
    return null;
}

// var script = document.createElement('script');
// script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
// document.head.appendChild(script);

var chromeRuntimePort = chrome.runtime.connect();
chromeRuntimePort.onDisconnect.addListener(() => {
    chromeRuntimePort = undefined;
});


const mouseEventLogger = async (event,actionType) => {

    console.log("Element Type", event.target.tagName.toLowerCase());
    console.log("Element Text", event.target.textContent);

    const tag = event.target.tagName.toLowerCase();
    const text = event.target.textContent;

    var screenWidth = window.screen.width;
    var screenHeight = window.screen.height;

    console.log('Screen width: ' + screenWidth);
    console.log('Screen height: ' + screenHeight);

    var x = event.clientX;
    var y = event.clientY;

    // Do something with the x and y coordinates (e.g., log them to the console)
    console.log('Clicked at position (' + x + ', ' + y + ')');


    var width =  event.target.offsetWidth;
    var height =  event.target.offsetHeight;

    // Do something with the width and height (e.g., log them to the console)
    console.log('Clicked element width: ' + width);
    console.log('Clicked element height: ' + height);

    // Selector
    const xpath = getElementXPath(event.target);
    console.log('Clicked element XPath:', xpath);
    // ID
    const elementID = getIDSelector(event.target);
    console.log('Clicked element ID:', elementID);

    // Class
    const elementClass = getElementSelector(event.target);
    console.log('Clicked element Class:', elementClass);

    var scrollX = window.scrollX || window.pageXOffset;
    var scrollY = window.scrollY || window.pageYOffset;

    // Get Image

    const imageBase64 = await html2canvas(event.target)

    const streamData = {
        screenWidth,
        screenHeight,
        x,
        y,
        width,
        height,
        xpath,
        elementID,
        elementClass,
        tag,
        text,
        scrollX,
        scrollY,
        action: actionType,
        image: imageBase64.toDataURL(),
        target: event.target,
        url : window.location.href
    }



    if (chromeRuntimePort) {
        chromeRuntimePort.postMessage({type: actionType, data: streamData});
    }

}

document.querySelector('body').addEventListener('click', async function(event) {

    await mouseEventLogger(event,'click')

   // console.log("Event",stringify_object(event))


    //
    // chrome.runtime.sendMessage().then((response) => {
    //     console.log('Response:', response);
    // });
});

// document.addEventListener('mousedown', function(event) {
//     console.log('Mouse down:', event);
// });
//
// document.addEventListener('mouseup', function(event) {
//     console.log('Mouse up:', event);
// });
//
// document.addEventListener('mousemove', function(event) {
//     console.log('Mouse move:', event);
// });

// document.addEventListener('click', function(event) {
//     console.log('Mouse click:', event);
// });

document.addEventListener('dblclick', async function(event) {
    console.log('Mouse double-click:', event);
    await mouseEventLogger(event,'dclick')


    // html2canvas(event.target).then(canvas => {
    //
    //     console.log(canvas.toDataURL())
    //     // var blob = canvas.toBlob((blob) => {
    //     //     url = window.URL.createObjectURL(blob)
    //     //     window.open(url)
    //     // }, "image/png")
    // });
});

const keyboardEventLogger = async (event,actionType) => {
    console.log('Key pressed: ' + event);

    console.log("Element Type", event.target.tagName.toLowerCase());
    console.log("Element Text", event.target.textContent);

    const tag = event.target.tagName.toLowerCase();
    const text = event.target.textContent;

    var screenWidth = window.screen.width;
    var screenHeight = window.screen.height;

    console.log('Screen width: ' + screenWidth);
    console.log('Screen height: ' + screenHeight);

    var x = event.clientX;
    var y = event.clientY;

    // Do something with the x and y coordinates (e.g., log them to the console)
    console.log('Clicked at position (' + x + ', ' + y + ')');


    var width =  event.target.offsetWidth;
    var height =  event.target.offsetHeight;

    // Do something with the width and height (e.g., log them to the console)
    console.log('Clicked element width: ' + width);
    console.log('Clicked element height: ' + height);

    // Selector
    const xpath = getElementXPath(event.target);
    console.log('Clicked element XPath:', xpath);
    // ID
    const elementID = getIDSelector(event.target);
    console.log('Clicked element ID:', elementID);

    // Class
    const elementClass = getElementSelector(event.target);
    console.log('Clicked element Class:', elementClass);

    var scrollX = window.scrollX || window.pageXOffset;
    var scrollY = window.scrollY || window.pageYOffset;

    // Get Image

    const streamData = {
        screenWidth,
        screenHeight,
        x,
        y,
        width,
        height,
        xpath,
        elementID,
        elementClass,
        tag,
        text: "",
        scrollX,
        scrollY,
        action: actionType,
        key: event.key,
        target: event.target,
        url : window.location.href
    }

    if (chromeRuntimePort) {
        chromeRuntimePort.postMessage({type: actionType, data: streamData});
    }
}

// Keyboard Events
document.addEventListener('keydown', async function(event) {
    await keyboardEventLogger(event,'keydown')
});

document.addEventListener('keyup', async function(event) {
    await keyboardEventLogger(event,'keyup')
});