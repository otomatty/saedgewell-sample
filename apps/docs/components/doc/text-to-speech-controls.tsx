'use client';

import { useState } from 'react';
import { useSpeechSynthesis } from '~/hooks/useSpeechSynthesis';
import { Play, Pause, Square, Settings, Bug } from 'lucide-react';

interface TextToSpeechControlsProps {
  text: string;
}

export function TextToSpeechControls({ text }: TextToSpeechControlsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const {
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
    debugInfo,
  } = useSpeechSynthesis();

  const handlePlay = () => {
    if (state.isPaused) {
      resume();
    } else {
      console.log('Play button clicked, text length:', text.length);
      speak(text);
    }
  };

  // テスト用の短いテキスト
  const handleTestVoice = () => {
    console.log('Testing voice with short text');
    speak('これはテスト音声です。This is a test voice.');
  };

  return (
    <div className="fixed bottom-4 right-4 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={handlePlay}
          disabled={state.isPlaying}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title={state.isPaused ? '再開' : '読み上げ開始'}
        >
          <Play className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={pause}
          disabled={!state.isPlaying || state.isPaused}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="一時停止"
        >
          <Pause className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={stop}
          disabled={state.isStopped}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="停止"
        >
          <Square className="h-6 w-6" />
        </button>

        <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-1" />

        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          title="設定"
        >
          <Settings className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={() => setShowDebug(!showDebug)}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          title="デバッグ情報"
        >
          <Bug className="h-6 w-6" />
        </button>
      </div>

      {showSettings && (
        <div className="mt-4 p-2 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-3">
            <label
              htmlFor="voice-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              音声
            </label>
            <select
              id="voice-select"
              value={currentVoice?.name || ''}
              onChange={(e) => {
                const selectedVoice = voices.find(
                  (voice) => voice.name === e.target.value
                );
                if (selectedVoice) {
                  changeVoice(selectedVoice);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm text-sm"
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label
              htmlFor="rate-slider"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              速度: {options.rate}
            </label>
            <input
              id="rate-slider"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={options.rate}
              onChange={(e) =>
                updateOptions({ rate: Number.parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="volume-slider"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              音量: {options.volume}
            </label>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={options.volume}
              onChange={(e) =>
                updateOptions({ volume: Number.parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="pitch-slider"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              音程: {options.pitch}
            </label>
            <input
              id="pitch-slider"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={options.pitch}
              onChange={(e) =>
                updateOptions({ pitch: Number.parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleTestVoice}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              テスト音声を再生
            </button>
          </div>
        </div>
      )}

      {showDebug && (
        <div className="mt-4 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono overflow-auto max-h-80">
          <h3 className="font-bold text-sm mb-2">デバッグ情報</h3>

          <div className="mb-2">
            <div className="font-semibold">テキスト:</div>
            <div>長さ: {text.length}文字</div>
            <div>空か: {!text.trim() ? 'はい' : 'いいえ'}</div>
            <div>サンプル: {text.substring(0, 100)}...</div>
          </div>

          <div className="mb-2">
            <div className="font-semibold">API状態:</div>
            <div
              className={
                debugInfo.speechSynthesisAvailable
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }
            >
              Speech Synthesis API:{' '}
              {debugInfo.speechSynthesisAvailable ? '利用可能' : '利用不可'}
            </div>
            <div
              className={
                debugInfo.voicesAvailable
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }
            >
              音声: {debugInfo.voicesCount}個利用可能
            </div>
          </div>

          <div className="mb-2">
            <div className="font-semibold">音声設定:</div>
            <div>
              日本語音声:{' '}
              {debugInfo.japaneseVoiceAvailable ? '利用可能' : '利用不可'}
            </div>
            <div>
              現在の音声: {debugInfo.currentVoiceName || 'なし'} (
              {debugInfo.currentVoiceLang || 'なし'})
            </div>
            <div>速度: {options.rate}</div>
            <div>音量: {options.volume}</div>
            <div>音程: {options.pitch}</div>
          </div>

          <div className="mb-2">
            <div className="font-semibold">再生状態:</div>
            <div>再生中: {state.isPlaying ? 'はい' : 'いいえ'}</div>
            <div>一時停止中: {state.isPaused ? 'はい' : 'いいえ'}</div>
            <div>停止中: {state.isStopped ? 'はい' : 'いいえ'}</div>
          </div>

          <div className="mb-2">
            <div className="font-semibold">API呼び出し:</div>
            <div>speak: {debugInfo.apiCalls.speak ? 'はい' : 'いいえ'}</div>
            <div>pause: {debugInfo.apiCalls.pause ? 'はい' : 'いいえ'}</div>
            <div>resume: {debugInfo.apiCalls.resume ? 'はい' : 'いいえ'}</div>
            <div>stop: {debugInfo.apiCalls.stop ? 'はい' : 'いいえ'}</div>
          </div>

          {debugInfo.lastError && (
            <div className="text-red-600 dark:text-red-400">
              <div className="font-semibold">最後のエラー:</div>
              <div>{debugInfo.lastError}</div>
            </div>
          )}

          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                // navigatorオブジェクトとブラウザの情報を出力
                console.log('Browser Info:', {
                  userAgent: navigator.userAgent,
                  platform: navigator.platform,
                  vendor: navigator.vendor,
                  language: navigator.language,
                  speechSynthesis: typeof window.speechSynthesis,
                });
              }}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-xs"
            >
              ブラウザ情報をコンソールに出力
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
