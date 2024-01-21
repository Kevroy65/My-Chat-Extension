// Handle iframe messages
window.addEventListener('message', (event) => {
  if (event.origin === 'https://my-chatbot-d59f5.web.app') {
    const data = event.data;
    // Process data received from the iframe
  }
});
