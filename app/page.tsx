'use client';

import { useState, useEffect } from 'react';
import Footer from './components/Footer';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
}

// 計算下一個週日 20:00 JST
function getNextSunday(): Date {
  const now = new Date();
  // 轉換為 JST (UTC+9)
  const jstOffset = 9 * 60; // 分鐘
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const jstTime = new Date(utcTime + (jstOffset * 60000));
  
  const currentDay = jstTime.getDay(); // 0 = 週日, 1 = 週一, ..., 6 = 週六
  const currentHour = jstTime.getHours();
  
  let daysUntilSunday = 0;
  
  // 如果今天是週日且時間還沒到 20:00
  if (currentDay === 0 && currentHour < 20) {
    daysUntilSunday = 0;
  } else {
    // 計算到下一個週日的天數
    daysUntilSunday = currentDay === 0 ? 7 : 7 - currentDay;
  }
  
  const targetDate = new Date(jstTime);
  targetDate.setDate(jstTime.getDate() + daysUntilSunday);
  targetDate.setHours(20, 0, 0, 0);
  
  return targetDate;
}

// 計算剩餘時間
function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date();
  const jstOffset = 9 * 60;
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const jstNow = new Date(utcTime + (jstOffset * 60000));
  
  const difference = targetDate.getTime() - jstNow.getTime();
  
  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isFinished: true,
    };
  }
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
  return {
    days,
    hours,
    minutes,
    seconds,
    isFinished: false,
  };
}

// 添加書籤功能
function addToBookmarks(): void {
  // 由於瀏覽器安全限制，無法直接添加書籤，提示用戶使用快捷鍵
  alert('このページをブックマークに追加するには:\n\nWindows: Ctrl + D\nMac: ⌘ + D\n\nを押してください。');
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // 初始化：僅在客戶端執行
  useEffect(() => {
    // 设置页面标题
    document.title = "資産運用セミナー | ライブ配信予告";
    
    setMounted(true);
    const target = getNextSunday();
    setTargetDate(target);
    setTimeLeft(calculateTimeLeft(target));
  }, []);
  
  // 倒計時更新：每秒執行
  useEffect(() => {
    if (!targetDate) return;
    
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.isFinished) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);
  
  // 防止 hydration 不匹配
  if (!mounted || !timeLeft || !targetDate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
          <div className="text-center text-slate-400">読み込み中...</div>
        </div>
      </div>
    );
  }
  
  // 格式化目標日期
  const formatTargetDate = () => {
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    const day = targetDate.getDate();
    return `${year}年${month}月${day}日（日）20:00`;
  };
  
  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 pb-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
          {/* 標題區域 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3 tracking-tight">
              資産運用セミナー
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-2">
              ライブ配信予告
            </p>
            <div className="inline-block bg-indigo-50 px-4 py-2 rounded-full mt-4">
              <p className="text-sm md:text-base text-indigo-700 font-medium">
                📅 {formatTargetDate()}
              </p>
            </div>
          </div>
          
          {/* 倒計時區域 */}
          <div className="mb-8">
            <p className="text-center text-slate-500 mb-6 text-sm md:text-base">
              配信開始まで
            </p>
            
            {!timeLeft.isFinished ? (
              <div className="grid grid-cols-4 gap-3 md:gap-4">
                {/* 天 */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4 md:p-6 text-center">
                  <div className="text-4xl md:text-5xl font-bold text-indigo-600">
                    {timeLeft.days}
                  </div>
                  <div className="text-sm text-slate-500 mt-2">日</div>
                </div>
                
                {/* 時 */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4 md:p-6 text-center">
                  <div className="text-4xl md:text-5xl font-bold text-indigo-600">
                    {timeLeft.hours}
                  </div>
                  <div className="text-sm text-slate-500 mt-2">時間</div>
                </div>
                
                {/* 分 */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4 md:p-6 text-center">
                  <div className="text-4xl md:text-5xl font-bold text-indigo-600">
                    {timeLeft.minutes}
                  </div>
                  <div className="text-sm text-slate-500 mt-2">分</div>
                </div>
                
                {/* 秒 */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4 md:p-6 text-center">
                  <div className="text-4xl md:text-5xl font-bold text-indigo-600">
                    {timeLeft.seconds}
                  </div>
                  <div className="text-sm text-slate-500 mt-2">秒</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-3">
                  配信開始時間になりました
                </div>
                <p className="text-slate-500">
                  ご参加ありがとうございます
                </p>
              </div>
            )}
          </div>
          
          {/* 書籤按鈕 */}
          <div className="text-center">
            <button
              onClick={addToBookmarks}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg text-sm md:text-base font-medium"
            >
              🔖 このページをブックマーク
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}