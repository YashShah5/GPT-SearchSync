(() => {
  // create the div element & label element 🤘
  const infoDiv = document.createElement("div");
  infoDiv.className = "gpt3-info";
  infoDiv.style =
"background-color: #303135; padding: 20px;  border-radius: 5px; color: #ffffff; font-size: 20px; font-weight: bold; margin: 10px 0; width: 40%; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative; overflow: hidden;";

  // ping background.js to call openai & get the answer 🧠
  chrome.runtime.sendMessage(
    { data: window.location.href },
    function (response) {
      if (response != undefined && response != "" && response != "No API key") {
        // if all is good, add the answer to the div 🏎
        infoDiv.innerHTML = `  
              GPT-SearchSync Answer 

              <h1 style="padding-top: 10px;">${response}</h1>
           `;
      } else {
        alert(
          "No response from OpenAI."
        );
      }
    }
  );

  // define where to place the box & inject in the dom 🥊
  let placementDiv = document.getElementsByClassName("appbar")[0];
  placementDiv.appendChild(infoDiv);
})();
