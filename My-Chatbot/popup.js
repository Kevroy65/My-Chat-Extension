// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getFirestore, collection, addDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


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

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const firestoreDB = getFirestore(firebaseApp);

// Get a reference to the database service
const database = getDatabase(app);

// Reference to the root of your database
const rootRef = ref(database);

// Array to store keyword-response pairs
const keywordResponsePairs = [];

// Set up a real-time listener to update keyword-response pairs whenever there's a change in the database
onValue(rootRef, (snapshot) => {
    // Clear existing data in the array
    keywordResponsePairs.length = 0;

    // Get the updated data from the snapshot
    const allData = snapshot.val();

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
      // Sanitize the user input before appending
      var sanitizedMessageText = sanitize(messageText);
      
      addMessageToFirestore(sanitizedMessageText);
      
      messages.push(sanitizedMessageText);
      var newMessageDiv = '<div class="reply-message-box"><p class="reply-message">' + sanitizedMessageText + '</p></div>';
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


    }
  });
});

// Function to get the current user's IP address
async function getUserIPAddress() {
    try {
        const response = await fetch('https://ipinfo.io/json');
        const data = await response.json();
        const ipAddress = data.ip;

        // Save the IP address to browser storage
        localStorage.setItem('userIpAddress', ipAddress);

        return ipAddress;
    } catch (error) {
        console.error('Error getting IP address:', error);
        return null;
    }
}

// Call the function to get the user's IP address
getUserIPAddress();

// Function to collect browser information and create a fingerprint
function createBrowserFingerprint() {
    // Collect browser information
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const plugins = Array.from(navigator.plugins).map(plugin => plugin.name);

    // Create fingerprint
    const fingerprint = {
        userAgent: userAgent,
        screenWidth: screenWidth,
        screenHeight: screenHeight,
        timeZone: timeZone,
        plugins: plugins
    };

    // Convert fingerprint to a string
    const fingerprintString = JSON.stringify(fingerprint);

    try {
        // Store fingerprint in local storage
        localStorage.setItem('browserFingerprint', fingerprintString);
    } catch (error) {
        console.error('Error storing browser fingerprint:', error);
    }
}

// Call the function to create browser fingerprint
createBrowserFingerprint();


// Function to add user data to Firestore
async function addUserDataToFirestore(ipAddress, browserFingerprint) {
    try {
        // Get a reference to Firestore
        const db = getFirestore(app);

        // Create a collection reference for user data
        const userCollectionRef = collection(db, 'user_data');

        // Data to be stored in the document
        const userData = {
            ipAddress: ipAddress,
            browserFingerprint: browserFingerprint,
            createdAt: new Date(), // Include a timestamp
        };

        // Add the document to the collection
        const docRef = await addDoc(userCollectionRef, userData);
        console.log("Document written with ID:", docRef.id);
    } catch (error) {
        console.error('Error adding user data to Firestore:', error);
    }
}

async function addMessageToFirestore(message) {
    try {
        // Retrieve the user's IP address and browser fingerprint from browser storage
        const ipAddress = localStorage.getItem('userIpAddress');
        const browserFingerprint = localStorage.getItem('browserFingerprint');

        // Check if the user's IP address and browser fingerprint exist
        if (!ipAddress || !browserFingerprint) {
            console.error('User IP address or browser fingerprint not found in browser storage.');
            return;
        }

        // Combine the user's IP address and browser fingerprint to create a unique string
        const combinedString = `${ipAddress}-${browserFingerprint}`;

        // Hash the combined string to generate a unique ID
        const userId = hashString(combinedString);

        // Get a reference to Firestore
        const db = getFirestore(app);

        // Create a reference to the user's document
        const userDocRef = doc(db, 'users', userId);

        // Add the message to the user's document
        await setDoc(userDocRef, {
            ipAddress: ipAddress,
            browserFingerprint: browserFingerprint,
            createdAt: new Date(), // Include a timestamp for user creation
            messages: {
                [Date.now()]: message // Use the timestamp as the key for each message
            }
        }, { merge: true }); // Merge with existing data if the document already exists

        console.log("Message added to user's document:", userId);
    } catch (error) {
        console.error('Error adding message to Firestore:', error);
    }
}

// Hashing function to generate a unique identifier
function hashString(str) {
    let hash = 0;
    if (str.length === 0) {
        return hash;
    }
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString();
}

// Retrieve the user's IP address and browser fingerprint from browser storage
const ipAddress = localStorage.getItem('userIpAddress');
const browserFingerprint = JSON.parse(localStorage.getItem('browserFingerprint'));

// Check if both the IP address and browser fingerprint exist
if (ipAddress && browserFingerprint) {
    // Call the function to add user data to Firestore
    addUserDataToFirestore(ipAddress, browserFingerprint);
} else {
    console.error('Some data is missing in browser storage.');
}

// Function to sanitize the message text
function sanitize(text) {
  // Implement your sanitization logic here
  // For example, you can remove any HTML or script tags using regex
  return text.replace(/<[^>]*>?/gm, '');
}
