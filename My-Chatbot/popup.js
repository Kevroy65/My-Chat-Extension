// Array of keyword-response pairs
var keywordResponsePairs = [
  {
    keywords: ['kevroy taylor', 'kevroy', 'taylor', 'name'],
    responses: ['Yes, that\'s me - Kevroy Taylor!', 'Kevroy Taylor, at your service!', 'You\'re talking to Kevroy Taylor himself!'],
    currentIndex: 0
  },
  {
    keywords: ['20 years old', 'twenty years old', 'age', 'old'],
    responses: ['I\'m currently 20 years old.', 'Yes, I am 20 years of age.', 'That\'s right, 20 years young!'],
    currentIndex: 0
  },
  {
    keywords: ['december 2', 'december 2nd', 'birthday', 'birth', '2003'],
    responses: ['My birthday is on December 2nd, 2003.', 'I was born on December 2, 2003.', 'December 2, 2003, is the day I came into this world.'],
    currentIndex: 0
  },
  {
    keywords: ['passion', 'enthusiastic', 'enthusiasm'],
    responses: ['I\'m very passionate about technology and cyber security.', 'My passion lies in the field of computer science, especially cyber security.', 'Being passionate about technology is a big part of who I am.'],
    currentIndex: 0
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
    responses: ["Hi, I'm Kevroy Taylor! Nice to meet you.", "Hello! Kevroy Taylor here. What's your name?", "Hey there! I'm Kevroy. How may I help you?", "Greetings! Kevroy Taylor at your service. What brings you here?"],
    currentIndex: 0
  },
  {
    keywords: ['university', 'cyber security', 'computer science', 'studies', 'education', 'academic'],
    responses: ['I began my academic journey in computer science at the University of Technology, focusing on cyber security.', 'Cyber security fascinates me! I dedicated five months to studying it intensively.', 'My education in computer science and cyber security has been an exciting journey.', "I'm passionate about learning, especially in fields like cyber security and technology."],
    currentIndex: 0
  },
  {
    keywords: ['work', 'job', 'professional', 'customer service', 'experience', 'occupation'],
    responses: ['I\'ve worked as a Customer Advocate in training, where I honed my interpersonal skills.', 'My professional experience includes a three-month stint at Hinduja Global Solutions, focusing on customer relations.', 'In my previous job, I learned a lot about customer service and relations.', 'I value the professional skills I gained in customer advocacy and support.'],
    currentIndex: 0
  },
  {
    keywords: ['personality', 'character', 'aspirations', 'goals', 'future', 'plan', 'ambition'],
    responses: ['I\'m known for my creativity and innovative thinking in technology.', 'My tall, thick, and handsome stature stands out, but it\'s my passion for tech that truly defines me.', 'I always seek new challenges and opportunities to grow in the tech industry.', 'Looking forward to exploring new horizons in computer science and making meaningful contributions.'],
    currentIndex: 0
  },
{
    keywords: ['romance', 'fantasy', 'website', 'library', 'story'],
    responses: [
      'Check out my romance fantasy website here: <a href="https://my-portfolio-44a91.web.app/#" target="_blank">https://my-portfolio-44a91.web.app/#</a>',
      'For a journey into romance and fantasy, visit my website: <a href="https://my-portfolio-44a91.web.app/#" target="_blank">https://my-portfolio-44a91.web.app/#</a>',
      'Interested in romance and fantasy? Explore my website: <a href="https://my-portfolio-44a91.web.app/#" target="_blank">https://my-portfolio-44a91.web.app/#</a>'
    ],
    currentIndex: 0
  },
  {
    keywords: ['utility', 'toolkit', 'chrome extension', 'download'],
    responses: [
      'Download my Utility Toolkit Chrome extension here: <a href="https://utility-toolkit-28700.web.app/" target="_blank">https://utility-toolkit-28700.web.app/</a>',
      'Need a handy toolkit? Get my Chrome extension from here: <a href="https://utility-toolkit-28700.web.app/" target="_blank">https://utility-toolkit-28700.web.app/</a>',
      'For the Utility Toolkit Chrome extension, visit: <a href="https://utility-toolkit-28700.web.app/" target="_blank">https://utility-toolkit-28700.web.app/</a>'
    ],
    currentIndex: 0
  }
  
  // You can add more keyword-response objects here
];

// Event listener code remains the same...

document.addEventListener("DOMContentLoaded", function() {
  var messages = []; // Array to store user messages

  document.getElementById("sendButton").addEventListener("click", function() {
    var messageText = document.getElementById("message").value.toLowerCase();

    if (messageText) {
      messages.push(messageText);
      var newMessageDiv = '<div class="reply-message-box"><p class="reply-message">' + messageText + '</p></div>';
      document.getElementById("view").innerHTML += newMessageDiv;

      var combinedResponse = [];
      var usedCategories = [];

      keywordResponsePairs.forEach(function(pair, index) {
        var matchFound = false;
        pair.keywords.forEach(function(keyword) {
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
});
