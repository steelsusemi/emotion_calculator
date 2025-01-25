'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type EmotionState = {
  emoji: string;
  color: string;
  description: string;
};

const MAX_DISPLAY_LENGTH = 12;

const getEmotionState = (value: number): EmotionState => {
  const absValue = Math.abs(value);
  
  if (value > 0) {
    if (absValue >= 1000000) return { emoji: '🤑', color: 'text-emerald-400', description: '대박!' };
    if (absValue >= 10000) return { emoji: '🥳', color: 'text-emerald-400', description: '신난다!' };
    if (absValue >= 1000) return { emoji: '😎', color: 'text-emerald-500', description: '멋져요!' };
    if (absValue >= 100) return { emoji: '😊', color: 'text-emerald-500', description: '행복해요' };
    return { emoji: '🙂', color: 'text-emerald-600', description: '좋아요' };
  }
  
  if (value < 0) {
    if (absValue >= 1000000) return { emoji: '😱', color: 'text-blue-400', description: '충격!' };
    if (absValue >= 10000) return { emoji: '😰', color: 'text-blue-400', description: '불안해요' };
    if (absValue >= 1000) return { emoji: '😢', color: 'text-blue-500', description: '슬퍼요' };
    if (absValue >= 100) return { emoji: '😕', color: 'text-blue-500', description: '걱정돼요' };
    return { emoji: '😐', color: 'text-blue-600', description: '음...' };
  }
  
  return { emoji: '😶', color: 'text-gray-500', description: '음...' };
};

const formatNumber = (num: string) => {
  const number = parseFloat(num);
  if (isNaN(number)) return '0';
  if (Math.abs(number) > 999999999999) return number.toExponential(5);
  return num;
};

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [showEmotion, setShowEmotion] = useState(false);

  const emotionState = getEmotionState(Number(display));

  const handleNumberInput = (num: string) => {
    if (display.length >= MAX_DISPLAY_LENGTH) return;
    
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    if (op === '❤️') {
      setDisplay(formatNumber(String(Number(display) * 2)));
      return;
    }
    if (op === '💔') {
      setDisplay(formatNumber(String(Number(display) / 2)));
      return;
    }
    if (op === '🔄') {
      setDisplay(formatNumber(String(-Number(display))));
      return;
    }

    setOperator(op);
    setPreviousValue(display);
    setWaitingForOperand(true);
  };

  const calculate = () => {
    if (!previousValue || !operator) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    let result = 0;

    switch (operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = prev / current;
        break;
    }

    setDisplay(formatNumber(String(result)));
    setOperator(null);
    setPreviousValue(null);
    setWaitingForOperand(true);
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const toggleEmotion = () => {
    setShowEmotion(!showEmotion);
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-slate-800 rounded-3xl shadow-2xl p-8 w-96"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-lg font-medium">Calculator</h1>
        <button
          onClick={toggleEmotion}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            showEmotion 
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
          }`}
        >
          Emotion {showEmotion ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="mb-6 bg-slate-900 rounded-2xl p-6">
        <div className="flex flex-col items-end">
          {showEmotion && (
            <motion.div
              key={emotionState.emoji}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-2 text-center"
            >
              <span className="text-4xl mb-1 block">{emotionState.emoji}</span>
              <span className={`text-sm ${emotionState.color}`}>
                {emotionState.description}
              </span>
            </motion.div>
          )}
          <div className="text-4xl font-bold text-white font-mono tracking-wider mt-2">
            {display}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <button
          onClick={clear}
          className="bg-red-500 hover:bg-red-600 text-white rounded-2xl h-16 text-lg transition-colors font-medium"
        >
          C
        </button>
        {showEmotion ? (
          <>
            <button
              onClick={() => handleOperator('🔄')}
              className="bg-slate-700 hover:bg-slate-600 text-white rounded-2xl h-16 text-lg transition-colors"
            >
              🔄
            </button>
            <button
              onClick={() => handleOperator('❤️')}
              className="bg-slate-700 hover:bg-slate-600 text-white rounded-2xl h-16 text-lg transition-colors"
            >
              ❤️
            </button>
            <button
              onClick={() => handleOperator('💔')}
              className="bg-slate-700 hover:bg-slate-600 text-white rounded-2xl h-16 text-lg transition-colors"
            >
              💔
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleOperator('(')}
              className="bg-slate-700 hover:bg-slate-600 text-white rounded-2xl h-16 text-lg transition-colors"
            >
              (
            </button>
            <button
              onClick={() => handleOperator(')')}
              className="bg-slate-700 hover:bg-slate-600 text-white rounded-2xl h-16 text-lg transition-colors"
            >
              )
            </button>
            <button
              onClick={() => handleOperator('%')}
              className="bg-slate-700 hover:bg-slate-600 text-white rounded-2xl h-16 text-lg transition-colors"
            >
              %
            </button>
          </>
        )}
        
        {['7', '8', '9', '÷'].map((btn) => (
          <button
            key={btn}
            onClick={() => 
              btn === '÷' ? handleOperator(btn) : handleNumberInput(btn)
            }
            className={`${
              btn === '÷' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-700 hover:bg-slate-600'
            } text-white rounded-2xl h-16 text-lg transition-colors font-medium`}
          >
            {btn}
          </button>
        ))}

        {['4', '5', '6', '×'].map((btn) => (
          <button
            key={btn}
            onClick={() => 
              btn === '×' ? handleOperator(btn) : handleNumberInput(btn)
            }
            className={`${
              btn === '×' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-700 hover:bg-slate-600'
            } text-white rounded-2xl h-16 text-lg transition-colors font-medium`}
          >
            {btn}
          </button>
        ))}

        {['1', '2', '3', '-'].map((btn) => (
          <button
            key={btn}
            onClick={() => 
              btn === '-' ? handleOperator(btn) : handleNumberInput(btn)
            }
            className={`${
              btn === '-' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-700 hover:bg-slate-600'
            } text-white rounded-2xl h-16 text-lg transition-colors font-medium`}
          >
            {btn}
          </button>
        ))}

        {['0', '.', '=', '+'].map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === '=') calculate();
              else if (btn === '+') handleOperator(btn);
              else handleNumberInput(btn);
            }}
            className={`${
              btn === '=' ? 'bg-emerald-500 hover:bg-emerald-600' :
              btn === '+' ? 'bg-amber-500 hover:bg-amber-600' : 
              'bg-slate-700 hover:bg-slate-600'
            } text-white rounded-2xl h-16 text-lg transition-colors font-medium`}
          >
            {btn}
          </button>
        ))}

        <button
          onClick={backspace}
          className="col-span-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl h-16 flex items-center justify-center mt-2 text-lg font-medium"
        >
          ⌫
        </button>
      </div>
    </motion.div>
  );
} 