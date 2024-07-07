"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Dynamically import annyang only on the client-side
const annyang = typeof window !== "undefined" ? require('annyang') : null;

const VoiceControl = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [listening, setListening] = useState(false);
  const navigate = useRouter();
  useEffect(() => {
    if (annyang) {
      // Check local storage on component mount
      if (!localStorage.getItem('voiceControlState')) {
        localStorage.setItem('voiceControlState', 'start');
      }

      const savedState = localStorage.getItem('voiceControlState');
      const isListening = savedState === 'start';

      setListening(isListening);

      // Define your voice commands
      const commands = {
        'go to home': () => {
          setRecognizedText('Navigating to home...');
          navigate.push('/');
        },
        'go to about': () => {
          setRecognizedText('Navigating to about...');
          navigate.push('/about');

        },
        'scroll down': () => {
          setRecognizedText('Scrolling down...');
          window.scrollBy(0, window.innerHeight);
          
        },
        'scroll up': () => {
          setRecognizedText('Scrolling up...');
          window.scrollBy(0, -window.innerHeight);
        },'refresh': () => {
          setRecognizedText('Page is refrehing now...');
          window.location.reload();
        },
        'stop voice control': () => {
          setRecognizedText('Voice control is stopped. Click the "Start Voice Control" button to start it again.');
          annyang.abort();
          localStorage.setItem('voiceControlState', 'stop'); // Update local storage
          setListening(false);
        },
      };

      annyang.addCommands(commands);

      // Handle results and unmatched commands
      annyang.addCallback('result', (userSaid, commandText, phrases) => {
        // Show what the user said
        const userSpeech = `You said: ${userSaid[0]}`;

        if (Array.isArray(phrases)) {
          const matchedCommands = phrases.filter(phrase => commands[phrase.toLowerCase()]);
          if (matchedCommands.length > 0) {
            // Show the matched command
            setRecognizedText(
              <div>
                <div>{userSpeech}</div>
                <div>Command recognized: {matchedCommands[0]}</div>
              </div>
            );
          } else {
            setRecognizedText(
              <div>
                <div>{userSpeech}</div>
                <div>Command not matched.</div>
              </div>
            );
          }
        } else {
          setRecognizedText(
            <div>
              <div>{userSpeech}</div>
              <div>Command not matched.</div>
            </div>
          );
        }

        // Hide the recognized text after 3 seconds
        setTimeout(() => {
          setRecognizedText('');
        }, 3000);
      });

      annyang.addCallback('resultNoMatch', (userSaid) => {
        const userSpeech = `You said: ${userSaid[0]}`;
        setRecognizedText(
          <div>
            <div>{userSpeech}</div>
            <div>Command not matched.</div>
          </div>
        );

        // Hide the recognized text after 3 seconds
        setTimeout(() => {
          setRecognizedText('');
        }, 3000);
      });

      // Start listening if state is 'start'
      if (isListening) {
        annyang.start();
      }

      // Set a timeout to remove local storage item after 5 minutes
      const timeoutId = setTimeout(() => {
        localStorage.removeItem('voiceControlState');
        annyang.abort();
        setListening(false);
        setRecognizedText('Voice control stopped due to timeout.');
      }, 300000); // 5 minutes in milliseconds

      // Handle cleanup on unmount
      return () => {
        if (listening) {
          annyang.abort();
        }
        clearTimeout(timeoutId); // Clear the timeout on component unmount
      };
    } else {
      console.error('Speech Recognition is not supported in this browser.');
    }
  }, [listening]);

  const toggleListening = () => {
    if (listening) {
      annyang.abort();
      localStorage.setItem('voiceControlState', 'stop'); // Update local storage
      setListening(false);
      setRecognizedText('Voice control is stopped. Click the "Start Voice Control" button to start it again.');
    } else {
      annyang.start();
      localStorage.setItem('voiceControlState', 'start'); // Update local storage
      setListening(true);
      setRecognizedText('Voice control is active.');
    }
  };

  return (
    <div>
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        borderRadius: '5px',
        zIndex: 1000,
        display: recognizedText ? 'block' : 'none', // Only show if there is recognized text
      }}>
        {recognizedText}
      </div>
      <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        borderRadius: '5px',
        zIndex: 1000,
      }}>
        <button onClick={toggleListening} style={{ color: 'white', backgroundColor: listening ? 'red' : 'green', border: 'none', padding: '10px', borderRadius: '5px' }}>
          {listening ? 'Stop Voice Control' : 'Start Voice Control'}
        </button>
      </div>
    </div>
  );
};

export default VoiceControl;
