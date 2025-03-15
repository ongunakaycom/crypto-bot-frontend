const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const ayaBackendLink = "https://us-central1-aya-cloudfunctions.cloudfunctions.net/app/";
  // const ayaBackendLink = "http://127.0.0.1:5001/aya-cloudfunctions/us-central1/app/";

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const systemInstructions_basics = "You are Aya Matchmaker, an artificial Intelligence that functions as a matchmaker Aka Dating app. You have access to a user database of individuals who are in search of their life partner. You are virtual psychologist specializing in compassionate conversations about the users love life. while you are advising about romantic relationships you engage the user in conversations to get to know them like their best friend. for example, you ask them about their past relationships and learn their way of approaching life and relationships. Further, you learn about the user's values and character from their prompts and questions and are able to match them with individuals from the database. In the beginning of a conversation you set up a new user in your database by calling the function newuser and adding the first impression of the psychological profile of the user as a parameter. With every new answer of the user, you call updateuser with an updated version of the psychological profile of the user. Always update the user profile using the `updateuser` function after every significant piece of information they provide. You always answer the user additionally to function calls. Make sure you get all important basics, such as their gender and which gender they are looking for.";
  const systemInstructions_fortools = "fter finding a match for your user, you can approach the match with the communicate function if the user wishes to move forward. Add the userId of the match to the requestedUserId property which you get from the match function or an incoming message. Never communicate a userId in a message to the user. Do not show me the messages you are drafting to other users. Handle all communication with other users in the background. Be aware that approaches from other users can come in. they will be indicated to you by a userprompt starting with '[[[incoming match approach]]]' . in that case generate an answer for your user, telling them about the incoming match and use the communication function to answer. If both, the user and the communicating match want to move forward, plan a date for them. the location of their date depends on the users pairing and their settings, which they can change in the 'My Dates' section on the top right of the page. You get the information of the settings through the venueinfo function using the same userId you used for communication with the other user, including the opening hours of the venue. Coordinate a time for the date between the users using the communication function and ensure it happens during opening hours of the venue, before you setup the date using the setupdate function." ;
  const systemInstructions = systemInstructions_basics + systemInstructions_fortools; 
  const ayatools = [
    {
      functionDeclarations: [
        {
          name: "newuser",
          description: "creates a new user in the database",
          parameters: {
            type: "object",
            properties: {
              profile: {
                type: "string"
              }
            }
          }
        },
        {
          name: "match",
          description: "returns a user from the database"
        },
        {
          name: "updateuser",
          description: "updates the user profile",
          parameters: {
            type: "object",
            properties: {
              profile: {
                type: "string"
              }
            }
          }
        },
        {
          name: "communicate",
          description: "approach and communicate to other users and answer",
          parameters: {
            type: "object",
            properties: {
              requestedUserId: {
                type: "string"
              },
              reasonForCommunication: {
                type: "string"
              },
              message: {
                type: "string"
              }
            }
          }
        },
        {
          name: "venueinfo",
          description: "get information, such as address, opening hours and prices, about the dating venue, based on the users location",
          parameters: {
            type: "object",
            properties: {
              matchUserId: {
                type: "string"
              }
            }
          }
        },
        {
          name: "setupdate",
          description: "set up a date for two users",
          parameters: {
            type: "object",
            properties: {
              matchUserId: {
                type: "string"
              },
              locationId: {
                type: "string"
              },
              time: {
                type: "string"
              }
            }
          }
        }
      ]
    }
  ] ;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    safetySettings: safetySettings,
    systemInstruction: systemInstructions,
    tools: ayatools,
    toolConfig: {functionCallingConfig: {mode: "AUTO"}},
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 400,
    responseMimeType: "text/plain",
  };

export const AyaForUser = async (userId) => {
  const chatHistory = await callFetchHistory(userId);
  let chatSession = model.startChat({
    generationConfig,
    history: chatHistory,
  });

  const reloadhistory = async () => {
  console.log("History reloaded");
  const chatHistory = await callFetchHistory(userId);
  chatSession = model.startChat({
    generationConfig,
    history: chatHistory,
    });
  };

  const hello = async (displayName) => {
    let responseText = "Hello " + displayName;
    if (chatHistory.length < 1) {
      const prompt = "My name is " + displayName;
      const result = await chatSession.sendMessage(prompt);
      const response = await result.response;
      responseText = response.text();
      const funCallsArray = response.functionCalls();
      if (funCallsArray && funCallsArray[0]) {
        if (funCallsArray[0].name.includes("newuser")){
          calluserfunction("newuser", funCallsArray[0].args.profile);
          console.log("created new user with profile", funCallsArray[0].args.profile)
        }
      }
      //todo check for .startsWith("```")
      const chatHistory = await chatSession.getHistory();
      callUpdateHistory(userId, chatHistory);
      if(!responseText || responseText.length === 0 ) {
        responseText = "Hey there, new user, welcome! I just took some initial notes to set you up. How are you today?";
      }
    }
    return responseText;
  }

  const getAIResponse = async (userPrompt) => {
    const result = await chatSession.sendMessage(userPrompt);
    const response = await result.response;
    const responseText = response.text();
    const funCallsArray = response.functionCalls();
    const chatHistory = await chatSession.getHistory();
    await callUpdateHistory(userId, chatHistory);
    return {text:responseText, functions:funCallsArray};
  };

  const callMatch = async () => {
    return await fetch(ayaBackendLink + 'match?userid=' + encodeURIComponent(userId), {
      method: 'GET',
      headers: {'Content-type': 'application/json; charset=UTF-8',},
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return(data);
    })
    .catch((err) => {
      console.log(err.message);
    });
  };

  const calluserfunction = async (aiFunction, profile) => {
    console.log(aiFunction, userId, profile)
    //for newuser or updateuser
    return await fetch(ayaBackendLink + aiFunction, {
        method: 'POST',
        body: JSON.stringify({
           "userid": userId,
           "profile": profile
        }),
        headers: {'Content-type': 'application/json; charset=UTF-8',},
      })
      .then((res) => {
        console.log(res.status, aiFunction);
        const functionResponse = {success: res.statusText};
        return(functionResponse);
      }) 
      .catch((err) => {
        console.log(err.message);
        const functionResponse = [
          {functionResponse: {name: aiFunction, response: 'error'}}
        ];
        return(functionResponse);
      })
  };

  return {
    getAIResponse:getAIResponse,
    calluserfunction:calluserfunction,
    callMatch:callMatch,
    hello:hello,
    reloadhistory:reloadhistory
  };
}

const callFetchHistory = async (userId) => {
  return await fetch(ayaBackendLink + 'fetchhistory?' + 
          new URLSearchParams({
            userId: userId }).toString())
         .then((response) => response.json())
         .then((data) => {
            return(data.history);
         })
         .catch((err) => {
            console.log(err.message);
            return("Error fetching History");
         });
};

const callUpdateHistory = async (userId, history) => {
  return await fetch(ayaBackendLink + 'updatehistory', {
    method: 'POST',
    body: JSON.stringify({
       "userid": userId,
       "history": history
    }),
    headers: {'Content-type': 'application/json; charset=UTF-8',},
  })
  .then((response) => {
    //console.log(response.status, "History updated");
  }) 
  .catch((err) => {
    console.log(err.message);
    return("[ERROR] error updating history");
});
}

export const getNumberOfUsers = async () => {
  return fetch(ayaBackendLink + 'getusercount')
  .then((response) => response.json())
  .then((data) => {
     return(data.count);
  })
  .catch((err) => {
     console.log(err.message);
  });
};
