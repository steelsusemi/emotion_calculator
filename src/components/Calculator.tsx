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
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
              EMOTION
            </span>
            <span className="text-white">CALC</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${showEmotion ? 'text-emerald-400' : 'text-slate-400'}`}>
              {showEmotion ? '😊' : '🤖'}
            </span>
            <button
              onClick={toggleEmotion}
              className={`
                px-3 py-1 rounded-lg text-xs font-medium transition-all
                border-2 
                ${showEmotion 
                  ? 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/10' 
                  : 'border-slate-600 text-slate-400 hover:bg-slate-700'
                }
              `}
            >
              {showEmotion ? 'EMOTIONAL' : 'NORMAL'}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-slate-900 rounded-2xl p-6">
        <div className="flex flex-col items-end">
          {showEmotion && (
            <motion.div
              key={emotionState.emoji}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-3 text-center"
            >
              <span className="text-5xl mb-2 block">{emotionState.emoji}</span>
              <span className={`text-sm font-medium ${emotionState.color}`}>
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
              className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl h-16 text-lg transition-colors"
            >
              🔄
            </button>
            <button
              onClick={() => handleOperator('❤️')}
              className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl h-16 text-lg transition-colors"
            >
              ❤️
            </button>
            <button
              onClick={() => handleOperator('💔')}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-2xl h-16 text-lg transition-colors"
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