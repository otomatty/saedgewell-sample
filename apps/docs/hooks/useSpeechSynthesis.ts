import { useState, useEffect, useCallback, useRef } from 'react';

type SpeechState = {
  isPlaying: boolean;
  isPaused: boolean;
  isStopped: boolean;
};

type SpeechOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
};

// デバッグ情報の型
type DebugInfo = {
  speechSynthesisAvailable: boolean;
  voicesAvailable: boolean;
  voicesCount: number;
  japaneseVoiceAvailable: boolean;
  currentVoiceName: string | null;
  currentVoiceLang: string | null;
  lastError: string | null;
  apiCalls: {
    speak: boolean;
    pause: boolean;
    resume: boolean;
    stop: boolean;
  };
  lastTextLength: number;
};

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [state, setState] = useState<SpeechState>({
    isPlaying: false,
    isPaused: false,
    isStopped: true,
  });
  const [options, setOptions] = useState<SpeechOptions>({
    rate: 1,
    pitch: 1,
    volume: 1,
    lang: 'ja-JP', // デフォルトで日本語
  });
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(
    null
  );
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // デバッグ情報
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    speechSynthesisAvailable: false,
    voicesAvailable: false,
    voicesCount: 0,
    japaneseVoiceAvailable: false,
    currentVoiceName: null,
    currentVoiceLang: null,
    lastError: null,
    apiCalls: {
      speak: false,
      pause: false,
      resume: false,
      stop: false,
    },
    lastTextLength: 0,
  });

  // Speech Synthesis APIが利用可能かチェック
  useEffect(() => {
    const isSpeechSynthesisAvailable =
      typeof window !== 'undefined' && 'speechSynthesis' in window;
    console.log('Speech Synthesis API available:', isSpeechSynthesisAvailable);

    setDebugInfo((prev) => ({
      ...prev,
      speechSynthesisAvailable: isSpeechSynthesisAvailable,
    }));
  }, []);

  // 音声リストの取得
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      try {
        const availableVoices = window.speechSynthesis.getVoices();
        console.log('Voices loaded:', availableVoices.length);

        if (availableVoices.length > 0) {
          console.log(
            'Available voices:',
            availableVoices.map((v) => `${v.name} (${v.lang})`)
          );
          setVoices(availableVoices);

          // 日本語音声をデフォルトに設定
          const japaneseVoice = availableVoices.find((voice) =>
            voice.lang.includes('ja-JP')
          );
          console.log(
            'Japanese voice found:',
            !!japaneseVoice,
            japaneseVoice?.name
          );

          if (japaneseVoice) {
            setCurrentVoice(japaneseVoice);
            setDebugInfo((prev) => ({
              ...prev,
              voicesAvailable: true,
              voicesCount: availableVoices.length,
              japaneseVoiceAvailable: true,
              currentVoiceName: japaneseVoice.name,
              currentVoiceLang: japaneseVoice.lang,
            }));
          } else {
            // 最初の音声を選択（すでに配列の長さが0より大きいことを確認済み）
            const firstVoice = availableVoices[0];
            // TypeScriptはこの時点でfirstVoiceが確実に存在することを認識できないため、
            // 念のためtype guardを使用
            if (firstVoice) {
              setCurrentVoice(firstVoice);
              setDebugInfo((prev) => ({
                ...prev,
                voicesAvailable: true,
                voicesCount: availableVoices.length,
                japaneseVoiceAvailable: false,
                currentVoiceName: firstVoice.name,
                currentVoiceLang: firstVoice.lang,
              }));
            }
          }
        } else {
          setDebugInfo((prev) => ({
            ...prev,
            voicesAvailable: false,
            voicesCount: 0,
            lastError: 'No voices available',
          }));
        }
      } catch (error) {
        console.error('Error loading voices:', error);
        setDebugInfo((prev) => ({
          ...prev,
          lastError:
            error instanceof Error
              ? error.message
              : 'Unknown error loading voices',
        }));
      }
    };

    loadVoices();

    // voiceschangedイベントがfire後のリロード
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // SpeechSynthesisインスタンスのリセット
  const reset = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      console.log('Resetting speech synthesis');
      window.speechSynthesis.cancel();
      setState({
        isPlaying: false,
        isPaused: false,
        isStopped: true,
      });

      setDebugInfo((prev) => ({
        ...prev,
        apiCalls: {
          ...prev.apiCalls,
          stop: true,
        },
      }));
    } catch (error) {
      console.error('Error resetting speech synthesis:', error);
      setDebugInfo((prev) => ({
        ...prev,
        lastError:
          error instanceof Error ? error.message : 'Unknown error in reset',
      }));
    }
  }, []);

  // テキストの読み上げ
  const speak = useCallback(
    (text: string) => {
      console.log('Speak called with text length:', text.length);
      setDebugInfo((prev) => ({
        ...prev,
        apiCalls: {
          ...prev.apiCalls,
          speak: true,
        },
        lastTextLength: text.length,
      }));

      if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.error('Speech Synthesis API not available');
        setDebugInfo((prev) => ({
          ...prev,
          lastError: 'Speech Synthesis API not available',
        }));
        return;
      }

      if (!text.trim()) {
        console.error('Empty text provided for speech');
        setDebugInfo((prev) => ({
          ...prev,
          lastError: 'Empty text provided for speech',
        }));
        return;
      }

      try {
        // 前の読み上げをキャンセル
        reset();

        // 新しい発話を作成
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        // 音声と設定を適用
        if (currentVoice) {
          console.log('Setting voice:', currentVoice.name, currentVoice.lang);
          utterance.voice = currentVoice;
        } else {
          console.warn('No voice selected');
        }

        utterance.rate = options.rate || 1;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;
        utterance.lang = options.lang || 'ja-JP';

        console.log('Utterance settings:', {
          voice: utterance.voice?.name,
          lang: utterance.lang,
          rate: utterance.rate,
          pitch: utterance.pitch,
          volume: utterance.volume,
        });

        // イベントハンドラ
        utterance.onstart = () => {
          console.log('Speech started');
          setState({ isPlaying: true, isPaused: false, isStopped: false });
        };

        utterance.onpause = () => {
          console.log('Speech paused');
          setState({ isPlaying: false, isPaused: true, isStopped: false });
        };

        utterance.onresume = () => {
          console.log('Speech resumed');
          setState({ isPlaying: true, isPaused: false, isStopped: false });
        };

        utterance.onend = () => {
          console.log('Speech ended');
          setState({ isPlaying: false, isPaused: false, isStopped: true });
        };

        utterance.onerror = (event) => {
          console.error('Speech error:', event);
          setState({ isPlaying: false, isPaused: false, isStopped: true });
          setDebugInfo((prev) => ({
            ...prev,
            lastError: `Speech error: ${event.error}`,
          }));
        };

        // 読み上げ開始
        console.log('Starting speech synthesis');
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Error in speech synthesis:', error);
        setDebugInfo((prev) => ({
          ...prev,
          lastError:
            error instanceof Error ? error.message : 'Unknown error in speak',
        }));
      }
    },
    [currentVoice, options, reset]
  );

  // 一時停止
  const pause = useCallback(() => {
    console.log('Pause called');
    setDebugInfo((prev) => ({
      ...prev,
      apiCalls: {
        ...prev.apiCalls,
        pause: true,
      },
    }));

    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.pause();
      setState((prev) => ({ ...prev, isPlaying: false, isPaused: true }));
    } catch (error) {
      console.error('Error pausing speech:', error);
      setDebugInfo((prev) => ({
        ...prev,
        lastError:
          error instanceof Error ? error.message : 'Unknown error in pause',
      }));
    }
  }, []);

  // 再開
  const resume = useCallback(() => {
    console.log('Resume called');
    setDebugInfo((prev) => ({
      ...prev,
      apiCalls: {
        ...prev.apiCalls,
        resume: true,
      },
    }));

    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.resume();
      setState((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
    } catch (error) {
      console.error('Error resuming speech:', error);
      setDebugInfo((prev) => ({
        ...prev,
        lastError:
          error instanceof Error ? error.message : 'Unknown error in resume',
      }));
    }
  }, []);

  // 停止
  const stop = useCallback(() => {
    console.log('Stop called');
    setDebugInfo((prev) => ({
      ...prev,
      apiCalls: {
        ...prev.apiCalls,
        stop: true,
      },
    }));
    reset();
  }, [reset]);

  // オプションの更新
  const updateOptions = useCallback((newOptions: Partial<SpeechOptions>) => {
    console.log('Updating options:', newOptions);
    setOptions((prev) => ({ ...prev, ...newOptions }));
  }, []);

  // 音声の変更
  const changeVoice = useCallback((voice: SpeechSynthesisVoice) => {
    console.log('Changing voice to:', voice.name, voice.lang);
    setCurrentVoice(voice);
    setDebugInfo((prev) => ({
      ...prev,
      currentVoiceName: voice.name,
      currentVoiceLang: voice.lang,
    }));
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    state,
    voices,
    currentVoice,
    changeVoice,
    options,
    updateOptions,
    debugInfo, // デバッグ情報を公開
  };
}
