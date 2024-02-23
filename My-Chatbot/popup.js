// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD7KHu2wT1edhr7eA1OTZgPe_ePfxTgQtc",
    authDomain: "my-chatbot-d59f5.firebaseapp.com",
    databaseURL: "https://my-chatbot-d59f5-default-rtdb.firebaseio.com",
    projectId: "my-chatbot-d59f5",
    storageBucket: "my-chatbot-d59f5.appspot.com",
    messagingSenderId: "932504358924",
    appId: "1:932504358924:web:6a05986285b626cda09e29",
    measurementId: "G-MPL0EJD479"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Get a reference to the database service
const database = getDatabase(app);

// Reference to the root of your database
const rootRef = ref(database);

// Array to store keyword-response pairs
const keywordResponsePairs = [];

// Set up a real-time listener to log all items and add them to the array
onValue(rootRef, (snapshot) => {
    const allData = snapshot.val();

    // Clear existing data in the array
    keywordResponsePairs.length = 0;

    // Iterate through each item and push it to the array
    for (const key in allData) {
        if (allData.hasOwnProperty(key)) {
            const item = allData[key];
            keywordResponsePairs.push(item);
        }
    }

    // Log the array or perform further actions with it
    //console.log(keywordResponsePairs);
});

document.addEventListener("DOMContentLoaded", async function () {
  // Retrieve stored messages from localStorage
  var storedMessages = localStorage.getItem('messages');
  var messages = storedMessages ? JSON.parse(storedMessages) : []; // Initialize messages array with stored data if available

  // Event listener code...
  document.getElementById("sendButton").addEventListener("click", async function (event) {
    event.preventDefault();
    // Play the sound effect immediately
    var sound = new Audio('Cash-Register.mp3');
    sound.play();

    var messageText = document.getElementById("message").value.toLowerCase();

    if (messageText) {
      messages.push(messageText);
      var newMessageDiv = '<div class="reply-message-box"><p class="reply-message">' + messageText + '</p></div>';
      document.getElementById("view").innerHTML += newMessageDiv;

      // Store messages array in localStorage
      localStorage.setItem('messages', JSON.stringify(messages));
      
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

      var botReplyDiv = '<div class="bot-reply-message-box"><div class="profile1">' +
        '</div><p class="bot-reply-message"><h2>Kevroy Taylor</h2>' + botReply + '</p></div>';
      document.getElementById("view").innerHTML += botReplyDiv;

      // Check if FontAwesome is defined before calling i2svg
      if (window.FontAwesome) {
        window.FontAwesome.dom.i2svg();
      }

      document.getElementById("message").value = '';

      // Automatically scroll to the bottom
      var view = document.getElementById("view");
      view.scrollTop = view.scrollHeight;
      
      // Log confirmation in console
      console.log('Message logged successfully!');
    }
  });
});
