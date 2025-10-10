import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import MessageList from './MessageList/MessageList.jsx';
import ChatInput from './ChatInput/ChatInput.jsx';
import { onValue, push, query, limitToLast, orderByChild } from 'firebase/database';
import { sendMessageToChatbot } from '../../Databases/brain';
import useTradeStore from '../../store/tradeStore';
import './ChatContainer.css';

const ChatContainer = ({ userMessagesRef, displayName, userAvatar, error, setError }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const tradeStore = useTradeStore();
  const { preferredMarket = 'coinbase', preferredCoin = 'btcusd' } = tradeStore;

  // Debug the entire store to see what's available
  useEffect(() => {
    console.log('🔍 Full tradeStore contents:', tradeStore);
    console.log('🔍 Trading pair configuration:', {
      market: preferredMarket,
      coin: preferredCoin,
      fullPair: `${preferredMarket}/${preferredCoin}`
    });
  }, [tradeStore, preferredMarket, preferredCoin]); 


  // Debug effect using Zustand store
  useEffect(() => {
    console.log('🔍 Current trading configuration from Zustand:', {
      preferredMarket,
      preferredCoin,
      // Add any other relevant store values you want to debug
    });
  }, [preferredMarket, preferredCoin]);

  const addMessage = useCallback(async (sender, text) => {
    if (!userMessagesRef) return;
    const message = { text, timestamp: Date.now(), sender };
    await push(userMessagesRef, message);
  }, [userMessagesRef]);

  useEffect(() => {
    if (!userMessagesRef) return;
    const messagesQuery = query(userMessagesRef, orderByChild('timestamp'), limitToLast(5));
    const unsubscribe = onValue(messagesQuery, snapshot => {
      const data = snapshot.val();
      if (data) {
        const msgs = Object.entries(data).map(([id, msg]) => ({ id, ...msg }));
        setMessages(msgs);
      }
    });
    return () => unsubscribe();
  }, [userMessagesRef]);

  useLayoutEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmitMessage = async (event) => {
    event.preventDefault();
    if (!inputText.trim()) return;

    setIsSending(true);
    setError(''); // Clear previous errors
    
    try {
      await addMessage('user', inputText);
      console.log('🔄 Calling chatbot with:', inputText, 'for', preferredMarket, preferredCoin);
      
      const responseText = await sendMessageToChatbot(inputText, preferredMarket, preferredCoin);
      console.log('✅ Chatbot response:', responseText);
      
      // Check if the response is an error message (starts with error indicators)
      if (responseText.includes('❌') || 
          responseText.includes('⚠️') || 
          responseText.includes('🌐') ||
          responseText.includes('⏰') ||
          responseText.includes('🛡️') ||
          responseText.toLowerCase().includes('unable to connect') ||
          responseText.toLowerCase().includes('service error') ||
          responseText.toLowerCase().includes('network connection')) {
        
        console.warn('⚠️ Chatbot returned error message:', responseText);
        // Still add the message but show error state
        await addMessage('bot', responseText);
        setError(responseText); // Show error in UI if needed
      } else {
        // Normal successful response
        await addMessage('bot', responseText);
      }
      
      setInputText('');
    } catch (err) {
      console.error('💥 Submit error:', err);
      // Only set generic error if we didn't already handle it
      if (!error) {
        setError('Failed to send message. Please check your connection and try again.');
      }
      // Add a generic error message to chat
      await addMessage('bot', '❌ Sorry, I encountered an error processing your request. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <MessageList
        messages={messages}
        messagesEndRef={messagesEndRef}
        displayname={displayName}
        userAvatar={userAvatar}
      />
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        onSubmit={handleSubmitMessage}
        isSending={isSending}
      />
    </>
  );
};

export default ChatContainer;