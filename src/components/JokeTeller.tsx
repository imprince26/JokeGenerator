import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Copy, RefreshCw, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const JokeTeller = () => {
  const [joke, setJoke] = useState({ setup: '', delivery: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showPunchline, setShowPunchline] = useState(false);

  const fetchJoke = async () => {
    setIsLoading(true);
    setShowPunchline(false);
    try {
      const response = await fetch(import.meta.env.VITE_JOKE_API);
      const data = await response.json();
      
      if (data.type === 'twopart') {
        setJoke({ setup: data.setup, delivery: data.delivery });
      } else {
        setJoke({ setup: data.joke, delivery: '' });
      }
    } catch (error) {
      console.error('Error fetching joke:', error);
      setJoke({ setup: 'Failed to fetch joke. Please try again!', delivery: '' });
    } finally {
      setIsLoading(false);
    }
  };

  const speakJoke = () => {
    if (!('speechSynthesis' in window)) {
      alert('Sorry, your browser does not support text-to-speech!');
      return;
    }
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const textToSpeak = joke.delivery ? `${joke.setup} ... ${joke.delivery}` : joke.setup;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      alert('Sorry, there was an error playing the speech.');
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = async () => {
    try {
      const textToCopy = joke.delivery 
        ? `${joke.setup}\n${joke.delivery}`
        : joke.setup;
      await navigator.clipboard.writeText(textToCopy);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      alert('Failed to copy to clipboard. Please try again.');
    }
  };

  useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-zinc-900">
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-indigo-950/20 rounded-full -top-10 -left-10 blur-3xl animate-pulse" />
        <div className="absolute w-96 h-96 bg-violet-950/20 rounded-full top-1/2 left-1/2 blur-3xl animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-950/20 rounded-full -bottom-10 -right-10 blur-3xl animate-pulse" />
      </div>

      <Card className="w-full max-w-xl bg-gray-950/50 backdrop-blur-xl border-gray-800 shadow-2xl relative">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 inline-block text-transparent bg-clip-text mb-2">
              Joke Generator
            </h1>
            <p className="text-gray-400">Discover something funny ✨</p>
          </div>

          {/* Joke Display */}
          <div className="min-h-48 flex flex-col items-center justify-center p-8 mb-8 bg-gray-950/60 rounded-lg backdrop-blur-sm border border-gray-800 shadow-inner">
            {isLoading ? (
              <RefreshCw className="animate-spin h-8 w-8 text-indigo-400" />
            ) : (
              <>
                <p className="text-2xl text-center text-gray-100 leading-relaxed mb-4">
                  {joke.setup}
                </p>
                {joke.delivery && (
                  <div className="w-full">
                    {showPunchline ? (
                      <p className="text-2xl text-center text-indigo-300 leading-relaxed mt-6 transition-all duration-300 ease-in-out">
                        {joke.delivery}
                      </p>
                    ) : (
                      <Button
                        onClick={() => setShowPunchline(true)}
                        className="w-full mt-6 bg-indigo-950/50 hover:bg-indigo-900/50 border border-indigo-800/50 transition-colors duration-300"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Reveal Punchline
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={fetchJoke}
              disabled={isLoading}
              className="bg-gradient-to-r from-gray-900 to-indigo-950 hover:from-gray-800 hover:to-indigo-900 border border-indigo-800/30 transition-all duration-300 px-6 py-4 h-auto hover:scale-105 hover:shadow-lg hover:shadow-indigo-950/50"
            >
              <RefreshCw className={`mr-2 h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              New Joke
            </Button>
            
            <Button
              onClick={speakJoke}
              disabled={isLoading}
              className="bg-gradient-to-r from-slate-900 to-violet-950 hover:from-slate-800 hover:to-violet-900 border border-violet-800/30 transition-all duration-300 px-6 py-4 h-auto hover:scale-105 hover:shadow-lg hover:shadow-violet-950/50"
            >
              <Volume2 className={`mr-2 h-5 w-5 ${isSpeaking ? 'animate-pulse' : ''}`} />
              {isSpeaking ? 'Stop' : 'Speak'}
            </Button>

            <Button
              onClick={copyToClipboard}
              disabled={isLoading}
              className="bg-gradient-to-r from-zinc-900 to-purple-950 hover:from-zinc-800 hover:to-purple-900 border border-purple-800/30 transition-all duration-300 px-6 py-4 h-auto hover:scale-105 hover:shadow-lg hover:shadow-purple-950/50"
            >
              <Copy className="mr-2 h-5 w-5" />
              Copy
            </Button>
          </div>

          {/* Copied Alert */}
          {showCopied && (
            <Alert className="mt-6 bg-green-950/20 border-green-900/30 backdrop-blur-sm transition-all duration-300">
              <AlertDescription className="text-center text-green-400">
                Joke copied to clipboard! 😄
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JokeTeller;