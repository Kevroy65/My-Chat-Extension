chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "displayHtml") {
        const div = document.createElement('div');
        div.innerHTML = request.htmlContent;
        document.body.appendChild(div); // Append the HTML content to the body of the active tab

        // Optionally show an alert or log to console
        alert("HTML content displayed successfully!");
        console.log("HTML content displayed: ", request.htmlContent);
    }
});
