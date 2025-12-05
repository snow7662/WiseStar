import React, { useState } from 'react';
import { Calculator, Send, Loader, CheckCircle, XCircle, Code, Brain } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SolveProblem = () => {
  const [question, setQuestion] = useState('');
  const [solving, setSolving] = useState(false);
  const [result, setResult] = useState(null);
  const [showSteps, setShowSteps] = useState(false);

  const handleSolve = async () => {
    if (!question.trim()) return;
    
    setSolving(true);
    setResult(null);
    
    // 模拟API调用
    setTimeout(() => {
      setResult({
        success: true,
        answer: '公比 q = 2',
        steps: [
          { type: 'reasoning', content: '设等比数列首项为a₁，公比为q' },
          { type: 'calculation', content: 'S₄ = a₁(1-q⁴)/(1-q) = 4', code: 'a1 * (1 - q**4) / (1 - q) = 4' },
          { type: 'calculation', content: 'S₈ = a₁(1-q⁸)/(1-q) = 68', code: 'a1 * (1 - q**8) / (1 - q) = 68' },
          { type: 'reasoning', content: '两式相除得：(1-q⁸)/(1-q⁴) = 17' },
          { type: 'calculation', content: '化简得：1+q⁴ = 17，所以 q⁴ = 16', code: 'q**4 = 16' },
          { type: 'calculation', content: '解得 q = 2（取正值）', code: 'q = 2' }
        ],
        statistics: {
          total_steps: 6,
          reasoning_steps: 3,
          calculation_steps: 3,
          time_used: '2.3s'
        }
      });
      setSolving(false);
    }, 2000);
  };

  const exampleQuestions = [
    '若一个等比数列的前4项和为4，前8项和为68，则该等比数列的公比为？',
    '求函数 f(x) = x³ - 3x + 1 在区间 [-2, 2] 上的最大值和最小值',
    '已知 sin(α) = 3/5，α ∈ (π/2, π)，求 cos(α) 的值'
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center tracking-tight">
            <Calculator className="w-8 h-8 mr-3 text-primary-600" />
            智能解题
          </h1>
          <p className="text-slate-600 mt-2">使用RePI系统自动解答数学题目</p>
        </div>
      </div>

      {/* 输入区域 */}
      <div className="card-elevated">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          输入题目
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="请输入数学题目，支持LaTeX格式..."
          className="textarea-field h-32 mb-4"
          disabled={solving}
        />
        
        {/* 示例题目 */}
        <div className="mb-4">
          <p className="text-sm text-slate-600 mb-2">示例题目：</p>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuestion(q)}
                className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                disabled={solving}
              >
                示例 {i + 1}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSolve}
          disabled={!question.trim() || solving}
          className="btn-primary w-full md:w-auto flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {solving ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              解题中...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              开始解题
            </>
          )}
        </button>
      </div>

      {/* 结果区域 */}
      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* 答案卡片 */}
          <div className={`card-elevated ${result.success ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                {result.success ? (
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 mr-2" />
                )}
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {result.success ? '解题成功' : '解题失败'}
                </h2>
              </div>
              <span className="badge badge-success">{result.statistics.time_used}</span>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-4 border border-green-100">
              <p className="text-sm text-slate-600 mb-2">最终答案：</p>
              <p className="text-2xl font-bold text-slate-900">{result.answer}</p>
            </div>

            {/* 统计信息 */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{result.statistics.total_steps}</div>
                <div className="text-xs text-slate-600">总步数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{result.statistics.reasoning_steps}</div>
                <div className="text-xs text-slate-600">推理步数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{result.statistics.calculation_steps}</div>
                <div className="text-xs text-slate-600">计算步数</div>
              </div>
            </div>

            <button
              onClick={() => setShowSteps(!showSteps)}
              className="btn-outline w-full"
            >
              {showSteps ? '隐藏' : '查看'}解题步骤
            </button>
          </div>

          {/* 解题步骤 */}
          {showSteps && (
            <div className="card-elevated animate-slide-up">
              <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">解题步骤</h3>
              <div className="space-y-4">
                {result.steps.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold mr-3 mt-1 shadow-soft">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {step.type === 'reasoning' ? (
                          <Brain className="w-4 h-4 text-purple-600 mr-2" />
                        ) : (
                          <Code className="w-4 h-4 text-blue-600 mr-2" />
                        )}
                        <span className="text-xs font-semibold text-slate-500 uppercase">
                          {step.type === 'reasoning' ? '推理' : '计算'}
                        </span>
                      </div>
                      <p className="text-slate-700 mb-2">{step.content}</p>
                      {step.code && (
                        <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-sm overflow-x-auto shadow-inner-soft">
                          <code>{step.code}</code>
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SolveProblem;
