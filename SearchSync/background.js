// Listen for messages from contentScript.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Parse the prompt from the URL
  const url = new URL(request.data);
  const prompt = url.searchParams.get("prompt"); // Assuming 'prompt' is a query parameter

  // Retrieve the API key securely from Chrome's local storage
  chrome.storage.local.get(['apiKey'], function(result) {
    const apiKey = result.apiKey;

    // Check if the API key is not set
    if (!apiKey) {
      console.error("No API key found in storage.");
      sendResponse({error: "API key is missing."});
      return;
    }

    // Make an API call to OpenAI
    fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "text-davinci-002", // Make sure this model is current
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    })
    .then(response => response.json())
    .then(data => {
      // Ensure there is a valid response
      if (data.choices && data.choices.length > 0) {
        sendResponse({text: data.choices[0].text});
      } else {
        console.error("Unexpected response structure from OpenAI:", data);
        sendResponse({error: "Invalid response structure from API."});
      }
    })
    .catch(error => {
      console.error("Error while fetching from OpenAI:", error);
      sendResponse({error: "Failed to fetch response from OpenAI."});
    });

    // Return true to indicate an asynchronous response
    return true;
  });
});
