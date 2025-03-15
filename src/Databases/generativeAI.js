// generativeAI.js

const faqData = [
  {
    "question": "What is Aya Matchmaker?",
    "answer": "Aya uses advanced AI algorithms to understand your personal values, interests, and lifestyle through in-depth conversations, and then matches you with compatible partners.",
    "category": "Introduction"
  },
  {
    "question": "How does Aya find matches?",
    "answer": "Aya analyzes your detailed responses to questions about your values, dreams, and lifestyle to identify potential life partners who share similar attributes.",
    "category": "Functionality"
  },
  {
    "question": "What sets Aya apart from other matchmakers?",
    "answer": "Aya differentiates itself by building a profound connection with users through genuine conversations and focusing on matching based on deep personal values rather than superficial traits.",
    "category": "Differentiation"
  },
  {
    "question": "How does Aya ensure my privacy?",
    "answer": "Aya employs top-notch security measures, including an exclusive database and encryption, to protect your data and maintain privacy.",
    "category": "Privacy"
  },
  {
    "question": "What type of matches can I expect?",
    "answer": "Aya provides matches that align with your personal values and lifestyle, focusing on long-term compatibility rather than just surface-level traits.",
    "category": "Results"
  },
  {
    "question": "How do I start using Aya?",
    "answer": "To get started, sign up on our platform, and Aya will guide you through the onboarding process to help you find your ideal match.",
    "category": "Onboarding"
  },
  {
    "question": "Can Aya match me with people outside my area?",
    "answer": "While Aya primarily focuses on matches within your selected location, you can receive suggestions based on your preferences for potential matches in other areas.",
    "category": "Location"
  },
  {
    "question": "What kind of questions will Aya ask?",
    "answer": "Aya will inquire about your values, lifestyle, and preferences to ensure that the matches are highly compatible with your personal goals and desires.",
    "category": "Interaction"
  },
  {
    "question": "How often should I update my profile?",
    "answer": "Regularly updating your profile ensures that Aya has the most accurate information to provide you with the best possible matches.",
    "category": "Profile Maintenance"
  },
  {
    "question": "Does Aya offer relationship advice?",
    "answer": "Yes, Aya provides personalized advice and tips based on your interactions and preferences to help you navigate your relationship journey.",
    "category": "Support"
  },
  {
    "question": "What if I don’t like a match?",
    "answer": "You can give feedback, and Aya will refine the search criteria to better align with your preferences for future matches.",
    "category": "Feedback"
  },
  {
    "question": "Is there a trial period for Aya?",
    "answer": "Aya offers a trial period allowing you to explore the service before committing long-term. This lets you experience the matchmaking process firsthand.",
    "category": "Trial"
  },
  {
    "question": "How does Aya handle sensitive information?",
    "answer": "Aya uses stringent security measures, including encryption and secure storage, to protect all sensitive information and ensure confidentiality.",
    "category": "Security"
  },
  {
    "question": "Can Aya help with international matches?",
    "answer": "Currently, Aya focuses on domestic matches but is planning to expand to international options in the future. Stay tuned for updates!",
    "category": "Expansion"
  },
  {
    "question": "How does Aya evaluate compatibility?",
    "answer": "Aya uses sophisticated algorithms and in-depth personal insights to evaluate compatibility, ensuring that suggested matches align well with your values and lifestyle.",
    "category": "Evaluation"
  },
  {
    "question": "What should I do if I encounter issues with Aya?",
    "answer": "If you face any issues, contact our support team, and we’ll assist you in resolving them promptly.",
    "category": "Support"
  },
  {
    "question": "Are there additional features in Aya?",
    "answer": "Yes, Aya offers features like personalized recommendations, detailed compatibility scoring, and more to enhance your matchmaking experience.",
    "category": "Features"
  },
  {
    "question": "How does Aya ensure high-quality matches?",
    "answer": "Aya ensures quality through a combination of an exclusive database and advanced algorithms that thoroughly evaluate and match users based on compatibility.",
    "category": "Quality"
  },
  {
    "question": "What are the benefits of using Aya?",
    "answer": "Aya offers a highly personalized matchmaking experience, focusing on deep insights into your values and lifestyle rather than just superficial traits.",
    "category": "Benefits"
  },
  {
    "question": "How does Aya compare to other matchmaking services?",
    "answer": "Aya stands out by prioritizing deep personal connections and privacy, unlike many other services that may focus on surface-level traits or have less stringent privacy measures.",
    "category": "Comparison"
  },
  {
    "question": "What is Aya's success rate?",
    "answer": "Aya boasts a high success rate due to its focus on deep compatibility and personalized matchmaking processes.",
    "category": "Success Rate"
  },
  {
    "question": "Can I pause my Aya subscription?",
    "answer": "Yes, you can pause your subscription at any time and resume it when you’re ready.",
    "category": "Subscription"
  }
];

const questionData = [
  {
    "id": "core_values",
    "question": "To find a match that truly resonates with you, could you share which core values are most important in your relationship? For instance, how do trust, communication, and shared goals fit into your vision of a strong relationship?"
  },
  {
    "id": "ideal_weekend",
    "question": "Envision your perfect weekend with a partner. What are the key activities or experiences that would make it ideal for you? Consider everything from adventurous outings to cozy, quiet moments."
  },
  {
    "id": "long_term_goals",
    "question": "Looking ahead, what are your long-term relationship goals? Are you thinking about milestones such as marriage, starting a family, or other significant achievements together?"
  },
  {
    "id": "balance_time",
    "question": "Balancing personal time with relationship time is vital. How do you manage this balance in your ideal relationship? What strategies or routines help you maintain a healthy mix of both?"
  },
  {
    "id": "shared_hobbies",
    "question": "What hobbies or interests do you enjoy that you'd like to share with a partner? How do you think engaging in these activities together could enhance your connection?"
  },
  {
    "id": "shared_goals",
    "question": "How important is it for you to align on goals and dreams with your partner? What types of shared aspirations do you believe are essential for a fulfilling relationship?"
  },
  {
    "id": "handling_disagreements",
    "question": "Disagreements are a natural part of any relationship. How do you prefer to handle conflicts and resolve them constructively? What approaches work best for you in maintaining harmony?"
  },
  {
    "id": "non_negotiables",
    "question": "Are there specific qualities or traits that are non-negotiable for you in a partner? These might include values like honesty, ambition, or kindness."
  },
  {
    "id": "role_of_communication",
    "question": "Effective communication is key in relationships. How do you envision communication playing a role in your ideal relationship, and what does effective communication look like to you?"
  },
  {
    "id": "managing_finances",
    "question": "Managing finances as a couple can be challenging. What are your thoughts on this, and what expectations do you have for sharing financial responsibilities and planning?"
  },
  {
    "id": "physical_affection",
    "question": "Physical affection and intimacy can significantly impact a relationship. How important are these aspects to you, and how do you prefer to express and receive affection?"
  },
  {
    "id": "perfect_date",
    "question": "Describe what your perfect date would look like. What elements would make it special for you, including the setting, activities, and overall atmosphere?"
  },
  {
    "id": "maintaining_relationships",
    "question": "Balancing a committed relationship with friendships and family is important. How do you approach maintaining these relationships, and what role do they play in your life?"
  },
  {
    "id": "time_together_apart",
    "question": "What are your expectations for time spent together versus time apart in a relationship? How do you envision achieving a satisfying balance between these aspects?"
  },
  {
    "id": "personal_growth",
    "question": "Personal growth and self-improvement are vital in a relationship. How do you prioritize and encourage these aspects for yourself and your partner?"
  },
  {
    "id": "role_of_humor",
    "question": "Humor can strengthen a relationship. How important is humor in your relationships, and can you share a memorable funny moment that highlights its role?"
  },
  {
    "id": "celebrating_milestones",
    "question": "Celebrating milestones and anniversaries can enhance your bond. How do you like to celebrate these special occasions, and what traditions or ideas do you have in mind?"
  },
  {
    "id": "ideal_vacation",
    "question": "Picture your ideal vacation with a partner. What destinations, activities, or experiences would make it unforgettable for you?"
  },
  {
    "id": "support_in_challenges",
    "question": "Life's challenges are inevitable. How do you expect to support and be supported by your partner during difficult times?"
  },
  {
    "id": "expressing_love",
    "question": "We all express love differently. What are your preferred ways to show and receive love in a relationship? Consider actions, words, or other gestures."
  },
  // Add other questions here
];

const { GoogleGenerativeAI } = require("@google/generative-ai");


const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: "System Instructions for Aya Matchmaker\nObjective: Develop an AI-driven matchmaking system focusing on deep personalization.\n\nPersonalized Matching: Match users based on values and lifestyle, not just looks.\nDeep Understanding: Engage users in meaningful conversations for better insights.\nExclusive Database: Ensure secure, high-quality matches and user privacy.\nPrivacy & Security: Implement robust data protection measures.\nAI-Powered Insights: Use advanced algorithms for accurate matches.\n\nUI: Intuitive and user-friendly design.\nUX: Build genuine connections through engaging interactions.\nPerformance: Optimize for efficiency and handle user data securely.\nCompliance: Follow data protection regulations and be transparent with users.\nEnd Note: Aya Matchmaker blends AI with personal insights to offer meaningful and private matchmaking experiences.",
});

const generationConfig = {
  temperature: 2,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 1024,
  responseMimeType: "text/plain",
};

const startChatSession = async (history) => {
  try {
    return await model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            {
              text: 'Start a new conversation',
            },
          ],
        },
        ...history,
      ],
    });
  } catch (error) {
    console.error('Error starting chat session:', error);
    throw new Error('Failed to start chat session');
  }
};

const sendMessageToChat = async (chatSession, inputText) => {
  try {
    const result = await chatSession.sendMessage(inputText);
    return result.response.text();
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
};

const getAIResponse = async (inputText) => {
  const history = [
    {
      role: 'user',
      parts: [
        {
          text: inputText,
        },
      ],
    },
    // Add any previous history if applicable
  ];

  try {
    const chatSession = await startChatSession(history);
    return await sendMessageToChat(chatSession, inputText);
  } catch (error) {
    console.error('Error fetching bot response:', error);
    throw new Error('Failed to fetch bot response');
  }
};

// Example usage of faqData and questionData
const getFAQ = (question) => {
  const faq = faqData.find(f => f.question === question);
  return faq ? faq.answer : 'FAQ not found';
};

const getQuestion = (id) => {
  const question = questionData.find(q => q.id === id);
  return question ? question.question : 'Question not found';
};

module.exports = {
  getAIResponse,
  getFAQ,
  getQuestion,
};