"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Dynamically import annyang only on the client-side
const annyang = typeof window !== "undefined" ? require('annyang') : null;

const VoiceControl = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [listening, setListening] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const navigate = useRouter();

  useEffect(() => {
    const requestMicrophoneAccess = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setPermissionDenied(false);
      } catch (error) {
        setPermissionDenied(true);
      }
    };

    requestMicrophoneAccess();

    if (annyang && !permissionDenied) {
      if (!localStorage.getItem('voiceControlState')) {
        localStorage.setItem('voiceControlState', 'start');
      }

      const savedState = localStorage.getItem('voiceControlState');
      const isListening = savedState === 'start';

      setListening(isListening);

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
        },
        'refresh': () => {
          setRecognizedText('Page is refreshing now...');
          window.location.reload();
        },
        'stop voice control': () => {
          setRecognizedText('Voice control is stopped. Click the "Start Voice Control" button to start it again.');
          annyang.abort();
          localStorage.setItem('voiceControlState', 'stop');
          setListening(false);
        },
      };

      annyang.addCommands(commands);

      annyang.addCallback('result', (userSaid, commandText, phrases) => {
        const userSpeech = `You said: ${userSaid[0]}`;

        if (Array.isArray(phrases)) {
          const matchedCommands = phrases.filter(phrase => commands[phrase.toLowerCase()]);
          if (matchedCommands.length > 0) {
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

        setTimeout(() => {
          setRecognizedText('');
        }, 3000);
      });

      if (isListening) {
        annyang.start();
      }

      const timeoutId = setTimeout(() => {
        localStorage.removeItem('voiceControlState');
        annyang.abort();
        setListening(false);
        setRecognizedText('Voice control stopped due to timeout.');
      }, 300000);

      return () => {
        if (listening) {
          annyang.abort();
        }
        clearTimeout(timeoutId);
      };
    } else {
      console.error('Speech Recognition is not supported in this browser.');
    }
  }, [listening, permissionDenied, navigate]);

  const toggleListening = () => {
    if (listening) {
      annyang.abort();
      localStorage.setItem('voiceControlState', 'stop');
      setListening(false);
      setRecognizedText('Voice control is stopped. Click the "Start Voice Control" button to start it again.');
    } else {
      annyang.start();
      localStorage.setItem('voiceControlState', 'start');
      setListening(true);
      setRecognizedText('Voice control is active.');
    }
  };

  return (
    <div>
      {permissionDenied ? (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          padding: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          borderRadius: '5px',
          zIndex: 1000,
        }}>
          Microphone access is required for voice control. Please allow microphone access in your browser settings.
        </div>
      ) : (
        <>
          <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            borderRadius: '5px',
            zIndex: 1000,
            display: recognizedText ? 'block' : 'none',
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
        </>
      )}
    </div>
  );
};

export default VoiceControl;
