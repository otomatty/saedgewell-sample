import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  checkGeminiApiKey,
  generateGeminiContent,
} from '../actions/gemini-speech';

type GeminiSpeechState = {
  isPlaying: boolean;
  isPaused: boolean;
  isStopped: boolean;
  isLoading: boolean;
};

type GeminiSpeechOptions = {
  voiceModel?: string; // 将来的に複数の音声モデルをサポート
  speed?: number; // 速度調整
};

// デバッグ情報の型
type DebugInfo = {
  apiAvailable: boolean;
  apiKey: boolean;
  lastError: string | null;
  apiCalls: {
    speak: boolean;
    pause: boolean;
    resume: boolean;
    stop: boolean;
  };
  textLength: number;
  connectionStatus: string;
  lastStopTime: string | null;
  speechSynthesisState: string;
};

/**
 * Gemini Multimodal Live APIを使用して音声合成を行うカスタムフック
 */
export function useGeminiSpeech() {
  const [state, setState] = useState<GeminiSpeechState>({
    isPlaying: false,
    isPaused: false,
    isStopped: true,
    isLoading: false,
  });
  const [options, setOptions] = useState<GeminiSpeechOptions>({
    voiceModel: 'gemini-1.5-pro',
    speed: 1.0,
  });

  // デバッグ情報
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    apiAvailable: false,
    apiKey: false,
    lastError: null,
    apiCalls: {
      speak: false,
      pause: false,
      resume: false,
      stop: false,
    },
    textLength: 0,
    connectionStatus: 'disconnected',
    lastStopTime: null,
    speechSynthesisState: 'stopped',
  });

  // WebSocket接続の参照
  const wsRef = useRef<WebSocket | null>(null);
  // 音声要素の参照
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // 音声バッファキュー
  const audioBufferQueue = useRef<Blob[]>([]);
  // 音声再生中フラグ
  const isPlayingRef = useRef<boolean>(false);

  // 初期化
  useEffect(() => {
    // APIキーの存在チェック（サーバーアクションを使用）
    checkGeminiApiKey()
      .then(({ hasApiKey }) => {
        setDebugInfo((prev) => ({
          ...prev,
          apiKey: hasApiKey,
          apiAvailable: typeof window !== 'undefined' && hasApiKey,
        }));
      })
      .catch((error) => {
        console.error('Error checking API key:', error);
        setDebugInfo((prev) => ({
          ...prev,
          lastError: 'Error checking API key',
        }));
      });

    // Audio要素の作成
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();

      // 音声再生終了時のイベントハンドラ
      audioRef.current.onended = () => {
        // 次の音声バッファがあれば再生
        if (audioBufferQueue.current.length > 0) {
          playNextAudioBuffer();
        } else if (isPlayingRef.current) {
          // 再生終了
          isPlayingRef.current = false;
          setState((prev) => ({
            ...prev,
            isPlaying: false,
            isStopped: true,
            isLoading: false,
          }));
        }
      };

      // エラーハンドラ
      audioRef.current.onerror = (error) => {
        console.error('Audio playback error:', error);
        setDebugInfo((prev) => ({
          ...prev,
          lastError: 'Audio playback error',
        }));
        resetState();
      };
    }

    return () => {
      // クリーンアップ
      closeWebSocketConnection();
    };
  }, []);

  // WebSocket接続を閉じる
  const closeWebSocketConnection = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.close();
        setDebugInfo((prev) => ({
          ...prev,
          connectionStatus: 'disconnected',
        }));
      } catch (error) {
        console.error('Error closing WebSocket:', error);
      }
    }
    wsRef.current = null;
  }, []);

  // 音声バッファを再生
  const playNextAudioBuffer = useCallback(() => {
    if (audioBufferQueue.current.length === 0 || !audioRef.current) return;

    const nextBuffer = audioBufferQueue.current.shift();
    if (!nextBuffer) return;

    // Blobオブジェクトからオーディオを再生
    const audioUrl = URL.createObjectURL(nextBuffer);
    audioRef.current.src = audioUrl;

    // 再生速度の設定
    if (options.speed) {
      audioRef.current.playbackRate = options.speed;
    }

    // 再生開始
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error('Error playing audio:', error);
        setDebugInfo((prev) => ({
          ...prev,
          lastError: `Error playing audio: ${error.message}`,
        }));
        resetState();
      });
    }
  }, [options.speed]);

  // 状態をリセット
  const resetState = useCallback(() => {
    // WebSocket接続を閉じる
    closeWebSocketConnection();

    // 音声バッファをクリア
    audioBufferQueue.current = [];

    // 再生中フラグをリセット
    isPlayingRef.current = false;

    // 状態をリセット
    setState({
      isPlaying: false,
      isPaused: false,
      isStopped: true,
      isLoading: false,
    });
  }, [closeWebSocketConnection]);

  // WebSocket接続を初期化
  const initWebSocketConnection = useCallback(
    (text: string) => {
      // サーバーアクションでAPIキーの確認
      checkGeminiApiKey()
        .then(async ({ hasApiKey }) => {
          if (!hasApiKey) {
            setDebugInfo((prev) => ({
              ...prev,
              lastError: 'Gemini API key is not set',
            }));
            return null;
          }

          try {
            // 既存の接続があれば閉じる
            closeWebSocketConnection();

            // 音声バッファをクリア
            audioBufferQueue.current = [];

            // サーバー側でAPIを呼び出し、クライアント側でのWebSocketのセットアップは行わない
            // 代わりにRESTベースのアプローチを使用
            const responseText = await generateGeminiContent(
              text,
              options.voiceModel || 'gemini-1.5-pro'
            );
            console.log('Generated response:', responseText);

            // Web Speech APIを使用した代替実装
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = 'ja-JP';
              utterance.rate = options.speed || 1.0;

              // 利用可能な日本語音声を探す
              const voices = window.speechSynthesis.getVoices();
              const japaneseVoice = voices.find((voice) =>
                voice.lang.includes('ja-JP')
              );
              if (japaneseVoice) {
                utterance.voice = japaneseVoice;
              }

              // イベントハンドラ
              utterance.onstart = () => {
                isPlayingRef.current = true;
                setState({
                  isPlaying: true,
                  isPaused: false,
                  isStopped: false,
                  isLoading: false,
                });
              };

              utterance.onend = () => {
                isPlayingRef.current = false;
                setState({
                  isPlaying: false,
                  isPaused: false,
                  isStopped: true,
                  isLoading: false,
                });
              };

              // 読み上げ開始
              window.speechSynthesis.speak(utterance);
            }

            return null;
          } catch (error) {
            console.error('Error in Gemini text-to-speech:', error);
            setDebugInfo((prev) => ({
              ...prev,
              lastError: `Error in Gemini text-to-speech: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }));
            resetState();
            return null;
          }
        })
        .catch((error) => {
          console.error('Error checking API key:', error);
          setDebugInfo((prev) => ({
            ...prev,
            lastError: 'Error checking API key',
          }));
          return null;
        });
    },
    [closeWebSocketConnection, options.voiceModel, options.speed, resetState]
  );

  // Base64エンコードされた文字列をBlobに変換
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  };

  // RESTAPIを使用したフォールバック実装（WebSocketの代わりに使用）
  const speakWithRESTAPI = useCallback(
    async (text: string) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        setDebugInfo((prev) => ({
          ...prev,
          speechSynthesisState: 'initializing',
        }));

        setDebugInfo((prev) => ({
          ...prev,
          speechSynthesisState: 'calling Gemini API',
        }));

        // サーバーアクションを使用してGemini APIを呼び出す
        try {
          const responseText = await generateGeminiContent(
            text,
            options.voiceModel || 'gemini-1.5-pro'
          );

          console.log('Generated response:', responseText);
          setDebugInfo((prev) => ({
            ...prev,
            speechSynthesisState: 'Gemini API response received',
          }));
        } catch (apiError) {
          console.error('Gemini API error:', apiError);
          setDebugInfo((prev) => ({
            ...prev,
            lastError: `Gemini API error: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`,
            speechSynthesisState: 'API error',
          }));
        }

        // ここでは仮実装として、Web Speech APIを使用して読み上げ
        if ('speechSynthesis' in window) {
          setDebugInfo((prev) => ({
            ...prev,
            speechSynthesisState: 'initializing Web Speech API',
          }));

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'ja-JP';
          utterance.rate = options.speed || 1.0;

          // 利用可能な日本語音声を探す
          const voices = window.speechSynthesis.getVoices();
          const japaneseVoice = voices.find((voice) =>
            voice.lang.includes('ja-JP')
          );
          if (japaneseVoice) {
            utterance.voice = japaneseVoice;
            setDebugInfo((prev) => ({
              ...prev,
              speechSynthesisState: `using voice: ${japaneseVoice.name}`,
            }));
          } else {
            setDebugInfo((prev) => ({
              ...prev,
              speechSynthesisState: 'no Japanese voice found, using default',
            }));
          }

          // イベントハンドラ
          utterance.onstart = () => {
            isPlayingRef.current = true;
            setState({
              isPlaying: true,
              isPaused: false,
              isStopped: false,
              isLoading: false,
            });
            setDebugInfo((prev) => ({
              ...prev,
              speechSynthesisState: 'speaking',
            }));
          };

          utterance.onend = () => {
            isPlayingRef.current = false;
            setState({
              isPlaying: false,
              isPaused: false,
              isStopped: true,
              isLoading: false,
            });
            setDebugInfo((prev) => ({
              ...prev,
              speechSynthesisState: 'completed',
            }));
          };

          utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setDebugInfo((prev) => ({
              ...prev,
              lastError: `Speech synthesis error: ${event.error}`,
              speechSynthesisState: `error: ${event.error}`,
            }));
            resetState();
          };

          // 読み上げ開始
          try {
            window.speechSynthesis.speak(utterance);
            console.log('Speech started');
          } catch (speakError) {
            console.error('Error starting speech:', speakError);
            setDebugInfo((prev) => ({
              ...prev,
              lastError: `Error starting speech: ${speakError instanceof Error ? speakError.message : 'Unknown error'}`,
              speechSynthesisState: 'speak() error',
            }));
            resetState();
          }
        } else {
          throw new Error('Web Speech API is not supported in this browser');
        }
      } catch (error) {
        console.error('Error in Gemini speech synthesis:', error);
        setDebugInfo((prev) => ({
          ...prev,
          lastError: `Error in Gemini speech synthesis: ${error instanceof Error ? error.message : 'Unknown error'}`,
          speechSynthesisState: 'error in synthesis process',
        }));
        resetState();
      }
    },
    [options.voiceModel, options.speed, resetState]
  );

  // テキスト読み上げ開始
  const speak = useCallback(
    (text: string) => {
      if (!text.trim()) {
        setDebugInfo((prev) => ({
          ...prev,
          lastError: 'Empty text provided',
        }));
        return;
      }

      setDebugInfo((prev) => ({
        ...prev,
        apiCalls: {
          ...prev.apiCalls,
          speak: true,
        },
        textLength: text.length,
      }));

      // この部分はプロトタイプなので、REST APIを使用したフォールバックを実装
      // 実際のMultimodal Live APIが利用可能になったら、WebSocketベースの実装に切り替える
      speakWithRESTAPI(text);

      // WebSocketベースの実装（将来的にサポートされるようになったら）
      // initWebSocketConnection(text);
    },
    [speakWithRESTAPI]
  );

  // 一時停止
  const pause = useCallback(() => {
    setDebugInfo((prev) => ({
      ...prev,
      apiCalls: {
        ...prev.apiCalls,
        pause: true,
      },
    }));

    if (audioRef.current) {
      audioRef.current.pause();
      setState((prev) => ({ ...prev, isPlaying: false, isPaused: true }));
    }
  }, []);

  // 再開
  const resume = useCallback(() => {
    setDebugInfo((prev) => ({
      ...prev,
      apiCalls: {
        ...prev.apiCalls,
        resume: true,
      },
    }));

    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error('Error resuming audio:', error);
        setDebugInfo((prev) => ({
          ...prev,
          lastError: `Error resuming audio: ${error.message}`,
        }));
      });
      setState((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
    }
  }, []);

  // 停止
  const stop = useCallback(() => {
    setDebugInfo((prev) => ({
      ...prev,
      apiCalls: {
        ...prev.apiCalls,
        stop: true,
      },
      lastStopTime: new Date().toISOString(),
      speechSynthesisState: 'speechSynthesis.cancel() called',
    }));

    // WebSocket接続を閉じる
    closeWebSocketConnection();

    // 音声再生を停止
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Web Speech APIの再生を停止（フォールバック実装用）
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // 音声バッファをクリア
    audioBufferQueue.current = [];

    // 状態をリセット
    isPlayingRef.current = false;
    setState({
      isPlaying: false,
      isPaused: false,
      isStopped: true,
      isLoading: false,
    });
  }, [closeWebSocketConnection]);

  // オプションの更新
  const updateOptions = useCallback(
    (newOptions: Partial<GeminiSpeechOptions>) => {
      setOptions((prev) => ({ ...prev, ...newOptions }));
    },
    []
  );

  return {
    speak,
    pause,
    resume,
    stop,
    state,
    options,
    updateOptions,
    debugInfo,
  };
}
