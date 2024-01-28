document.addEventListener("DOMContentLoaded", function () {
  var messages = []; // Array to store user messages
  var keywordResponsePairs = []; // Array to store keyword-response pairs

  // Fetch the content of the JSON file
  fetch('Chatbot-Data.json')
    .then(response => response.json())  // Parse the content into JSON
    .then(data => {
      keywordResponsePairs = data;  // Assign the parsed JSON to keywordResponsePairs
      console.log('JSON data loaded successfully:', keywordResponsePairs); // Log the loaded JSON data

      // Event listener code remains the same...
      document.getElementById("sendButton").addEventListener("click", function () {
        var messageText = document.getElementById("message").value.toLowerCase();

        if (messageText) {
          messages.push(messageText);
          var newMessageDiv = '<div class="reply-message-box"><p class="reply-message">' + messageText + '</p></div>';
          document.getElementById("view").innerHTML += newMessageDiv;

          var combinedResponse = [];
          var usedCategories = [];

          keywordResponsePairs.forEach(function (pair, index) {
            var matchFound = false;
            pair.keywords.forEach(function (keyword) {
              if (messageText.includes(keyword)) {
                matchFound = true;
              }
            });
            if (matchFound && !usedCategories.includes(index)) {
              combinedResponse.push(pair.responses[pair.currentIndex]);
              pair.currentIndex = (pair.currentIndex + 1) % pair.responses.length;
              usedCategories.push(index);
            }
          });

          var botReply = combinedResponse.length > 0 ? combinedResponse.join(' ') : "I'm not sure how to respond to that.";

          var botReplyDiv = '<div class="bot-reply-message-box"><p class="bot-reply-message">' + botReply + '</p></div>';
          document.getElementById("view").innerHTML += botReplyDiv;

          document.getElementById("message").value = '';
        }
      });
    })
    .catch(error => console.error('Error fetching the JSON file:', error));
});
