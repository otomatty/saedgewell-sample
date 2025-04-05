'use client';

import { useState } from 'react';
import { useGeminiSpeech } from '~/hooks/useGeminiSpeech';
import { Play, Pause, Square, Settings, Bug, RefreshCw } from 'lucide-react';

interface GeminiSpeechControlsProps {
  text: string;
}

export function GeminiSpeechControls({ text }: GeminiSpeechControlsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const {
    speak,
    pause,
    resume,
    stop,
    state,
    options,
    updateOptions,
    debugInfo,
  } = useGeminiSpeech();

  const handlePlay = () => {
    if (state.isPaused) {
      resume();
    } else {
      console.log('Gemini Play button clicked, text length:', text.length);
      speak(text);
    }
  };

  // テスト用の短いテキスト
  const handleTestVoice = () => {
    console.log('Testing Gemini voice with short text');
    speak(
      'これはGemini APIを使用したテスト音声です。This is a test voice with Gemini API.'
    );
  };

  return (
    <div className="fixed bottom-20 right-4 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2">
      <div className="flex items-center space-x-1">
        <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-md mr-1">
          Gemini
        </div>
        <button
          type="button"
          onClick={handlePlay}
          disabled={state.isPlaying}
          className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title={state.isPaused ? '再開' : '読み上げ開始 (Gemini API)'}
        >
          {state.isLoading ? (
            <RefreshCw className="h-6 w-6 animate-spin" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </button>

        <button
          type="button"
          onClick={pause}
          disabled={!state.isPlaying || state.isPaused}
          className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="一時停止"
        >
          <Pause className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={stop}
          disabled={state.isStopped}
          className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="停止"
        >
          <Square className="h-6 w-6" />
        </button>

        <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-1" />

        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
              htmlFor="gemini-model-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              モデル
            </label>
            <select
              id="gemini-model-select"
              value={options.voiceModel || 'gemini-1.5-pro'}
              onChange={(e) => updateOptions({ voiceModel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm text-sm"
            >
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            </select>
          </div>

          <div className="mb-3">
            <label
              htmlFor="gemini-speed-slider"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              速度: {options.speed}
            </label>
            <input
              id="gemini-speed-slider"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={options.speed}
              onChange={(e) =>
                updateOptions({ speed: Number.parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleTestVoice}
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              テスト音声を再生
            </button>
          </div>
        </div>
      )}

      {showDebug && (
        <div className="mt-4 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono overflow-auto max-h-80">
          <h3 className="font-bold text-sm mb-2">Gemini デバッグ情報</h3>

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
                debugInfo.apiAvailable
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }
            >
              Gemini API: {debugInfo.apiAvailable ? '利用可能' : '利用不可'}
            </div>
            <div
              className={
                debugInfo.apiKey
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }
            >
              APIキー: {debugInfo.apiKey ? '設定済み' : '未設定'}
            </div>
            <div>接続状態: {debugInfo.connectionStatus}</div>
          </div>

          <div className="mb-2">
            <div className="font-semibold">設定:</div>
            <div>モデル: {options.voiceModel}</div>
            <div>速度: {options.speed}</div>
          </div>

          <div className="mb-2">
            <div className="font-semibold">再生状態:</div>
            <div>読み込み中: {state.isLoading ? 'はい' : 'いいえ'}</div>
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

          <div className="mb-2">
            <div className="font-semibold">停止情報:</div>
            <div>最後の停止時間: {debugInfo.lastStopTime || 'なし'}</div>
            <div>SpeechSynthesis状態: {debugInfo.speechSynthesisState}</div>
          </div>
        </div>
      )}
    </div>
  );
}
