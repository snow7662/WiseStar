import React, { useState } from 'react';
import { Trophy, Star, Lock, CheckCircle, XCircle, ArrowRight, RotateCcw, Zap, Target } from 'lucide-react';

const ChallengeMode = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [startTime, setStartTime] = useState(null);

  const difficulties = [
    { id: 'easy', name: '简单', color: 'from-green-500 to-emerald-500', icon: '🌱', levels: 10 },
    { id: 'medium', name: '中等', color: 'from-blue-500 to-cyan-500', icon: '🔥', levels: 10 },
    { id: 'hard', name: '困难', color: 'from-purple-500 to-pink-500', icon: '💎', levels: 10 }
  ];

  const mockLevels = {
    easy: [
      {
        id: 1,
        title: '第1关：集合基础',
        question: '已知集合 A = {1, 2, 3}，B = {2, 3, 4}，求 A ∩ B。',
        answer: '{2, 3}',
        hint: '交集是两个集合共有的元素',
        stars: 0,
        completed: false,
        locked: false
      },
      {
        id: 2,
        title: '第2关：集合运算',
        question: '已知集合 A = {x | x² - 3x + 2 = 0}，求集合 A。',
        answer: '{1, 2}',
        hint: '解一元二次方程',
        stars: 0,
        completed: false,
        locked: true
      }
    ],
    medium: [
      {
        id: 1,
        title: '第1关：函数性质',
        question: '判断函数 f(x) = x³ 的奇偶性。',
        answer: '奇函数',
        hint: '检查 f(-x) 与 f(x) 的关系',
        stars: 0,
        completed: false,
        locked: false
      }
    ],
    hard: [
      {
        id: 1,
        title: '第1关：导数应用',
        question: '已知函数 f(x) = x³ - 3x + 1，求 f(x) 的极值。',
        answer: '极大值 f(-1) = 3，极小值 f(1) = -1',
        hint: '先求导，令导数为0找极值点',
        stars: 0,
        completed: false,
        locked: false
      }
    ]
  };

  const [levels, setLevels] = useState(mockLevels);

  const startChallenge = (difficulty) => {
    setSelectedDifficulty(difficulty);
    const firstLevel = levels[difficulty.id][0];
    setCurrentLevel(firstLevel);
    setStartTime(Date.now());
    setShowAnswer(false);
    setLevelComplete(false);
    setUserAnswer('');
  };

  const handleCorrect = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    let stars = 3;
    if (timeSpent > 120) stars = 1;
    else if (timeSpent > 60) stars = 2;

    const updatedLevels = { ...levels };
    const levelIndex = updatedLevels[selectedDifficulty.id].findIndex(l => l.id === currentLevel.id);
    updatedLevels[selectedDifficulty.id][levelIndex].completed = true;
    updatedLevels[selectedDifficulty.id][levelIndex].stars = stars;
    
    if (levelIndex + 1 < updatedLevels[selectedDifficulty.id].length) {
      updatedLevels[selectedDifficulty.id][levelIndex + 1].locked = false;
    }
    
    setLevels(updatedLevels);
    setLevelComplete(true);

    const exp = stars * 10;
    const currentExp = parseInt(localStorage.getItem('userExp') || '0');
    localStorage.setItem('userExp', (currentExp + exp).toString());
  };

  const handleWrong = () => {
    alert('再想想，可以查看提示哦！');
  };

  const nextLevel = () => {
    const levelIndex = levels[selectedDifficulty.id].findIndex(l => l.id === currentLevel.id);
    if (levelIndex + 1 < levels[selectedDifficulty.id].length) {
      const next = levels[selectedDifficulty.id][levelIndex + 1];
      setCurrentLevel(next);
      setStartTime(Date.now());
      setShowAnswer(false);
      setLevelComplete(false);
      setUserAnswer('');
    }
  };

  const backToLevels = () => {
    setCurrentLevel(null);
    setShowAnswer(false);
    setLevelComplete(false);
  };

  const backToMenu = () => {
    setSelectedDifficulty(null);
    setCurrentLevel(null);
  };

  if (currentLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={backToLevels} className="btn-outline">
              ← 返回关卡列表
            </button>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-slate-700">
                {currentLevel.title}
              </span>
            </div>
          </div>

          <div className="card-elevated">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">题目</h3>
              <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                {currentLevel.question}
              </p>
            </div>

            {!showAnswer && !levelComplete && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">💡 提示：</span>
                  {currentLevel.hint}
                </p>
              </div>
            )}

            {showAnswer && !levelComplete && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 animate-slide-up">
                <h4 className="font-semibold text-green-900 mb-2">参考答案：</h4>
                <p className="text-green-800">{currentLevel.answer}</p>
              </div>
            )}

            {levelComplete && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 mb-6 animate-slide-up">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-center text-green-900 mb-2">
                  恭喜过关！
                </h3>
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3].map(i => (
                    <Star
                      key={i}
                      className={`w-8 h-8 ${
                        i <= levels[selectedDifficulty.id].find(l => l.id === currentLevel.id).stars
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-center text-slate-600 mb-4">
                  获得经验值：+{levels[selectedDifficulty.id].find(l => l.id === currentLevel.id).stars * 10}
                </p>
                <div className="flex gap-3">
                  <button onClick={backToLevels} className="btn-outline flex-1">
                    返回关卡
                  </button>
                  {levels[selectedDifficulty.id].findIndex(l => l.id === currentLevel.id) + 1 < levels[selectedDifficulty.id].length && (
                    <button onClick={nextLevel} className="btn-primary flex-1">
                      下一关 <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {!levelComplete && (
              <div className="space-y-3">
                {!showAnswer ? (
                  <>
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="btn-outline w-full"
                    >
                      查看答案
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleCorrect}
                      className="btn-primary flex items-center justify-center"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      答对了
                    </button>
                    <button
                      onClick={handleWrong}
                      className="btn-outline flex items-center justify-center border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      答错了
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (selectedDifficulty) {
    const difficultyLevels = levels[selectedDifficulty.id];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={backToMenu} className="btn-outline">
              ← 返回难度选择
            </button>
            <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${selectedDifficulty.color} text-white font-bold`}>
              {selectedDifficulty.icon} {selectedDifficulty.name}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {difficultyLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => !level.locked && startChallenge(selectedDifficulty)}
                disabled={level.locked}
                className={`relative p-6 rounded-2xl border-2 transition-all ${
                  level.locked
                    ? 'bg-slate-100 border-slate-300 cursor-not-allowed opacity-50'
                    : level.completed
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 hover:shadow-lg'
                    : 'bg-white border-primary-200 hover:border-primary-400 hover:shadow-lg'
                }`}
              >
                {level.locked && (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>
                )}
                
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl font-bold ${
                    level.completed
                      ? 'bg-green-500 text-white'
                      : level.locked
                      ? 'bg-slate-300 text-slate-500'
                      : 'bg-primary-500 text-white'
                  }`}>
                    {level.id}
                  </div>
                  
                  <h3 className="font-semibold text-slate-900 mb-2 text-sm">
                    {level.title}
                  </h3>
                  
                  {level.completed && (
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3].map(i => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i <= level.stars
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-600 to-primary-700 mb-6 shadow-large">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">闯关练习</h1>
          <p className="text-lg text-slate-600">选择难度，开始你的挑战之旅</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.id}
              onClick={() => startChallenge(difficulty)}
              className="group relative overflow-hidden rounded-2xl bg-white border-2 border-slate-200 hover:border-primary-400 p-8 transition-all hover:shadow-large hover:-translate-y-1"
            >
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${difficulty.color}`} />
              
              <div className="text-center">
                <div className="text-6xl mb-4">{difficulty.icon}</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {difficulty.name}
                </h2>
                <p className="text-slate-600 mb-4">
                  共 {difficulty.levels} 关
                </p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${difficulty.color} text-white font-semibold`}>
                  <Target className="w-4 h-4" />
                  开始挑战
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 card-elevated bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">🎮 闯关规则</h2>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>每个难度包含多个关卡，需要按顺序完成</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>答题后查看答案，自己判断对错</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>答对才能进入下一关，根据用时获得 1-3 星评价</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>完成关卡获得经验值，星级越高经验越多</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChallengeMode;
