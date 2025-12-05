export const processUserMessage = async (userMessage) => {
  const message = userMessage.toLowerCase().trim();
  
  if (message.includes('解题') || message.includes('求解') || message.includes('计算')) {
    return await handleSolveProblem(userMessage);
  }
  
  if (message.includes('生成') || message.includes('出题') || message.includes('题目')) {
    return await handleGenerateQuestion(userMessage);
  }
  
  if (message.includes('统计') || message.includes('数据') || message.includes('分析')) {
    return await handleStatistics(userMessage);
  }
  
  if (message.includes('错题') || message.includes('记忆') || message.includes('历史')) {
    return await handleMemory(userMessage);
  }
  
  return {
    content: '我是WiseStar数学助手，我可以帮你：\n\n1. **解题** - 输入数学题目，我会帮你求解\n2. **出题** - 根据知识点生成练习题\n3. **查看统计** - 分析你的学习数据\n4. **查看错题** - 回顾学习历史\n\n请告诉我你需要什么帮助？',
    metadata: null
  };
};

const handleSolveProblem = async (question) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const mockResult = {
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
  };
  
  return {
    content: '我已经完成了这道题的求解，以下是详细的解题过程：',
    metadata: {
      type: 'solve_result',
      data: mockResult
    }
  };
};

const handleGenerateQuestion = async (userMessage) => {
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  const mockResult = {
    success: true,
    problem: '已知函数 f(x) = x³ - 3ax + b，其中 a, b ∈ ℝ。\n\n(1) 讨论函数 f(x) 的单调性；\n\n(2) 若 f(x) 在 x = 1 处取得极值 2，求 a, b 的值；\n\n(3) 在(2)的条件下，求 f(x) 在区间 [-2, 2] 上的最大值和最小值。',
    quality_score: 8.5
  };
  
  return {
    content: '我已经为你生成了一道高质量的数学题目：',
    metadata: {
      type: 'generate_result',
      data: mockResult
    }
  };
};

const handleStatistics = async (userMessage) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    content: '这是你最近的学习统计数据：\n\n- 总共完成了 **25 道题目**\n- 成功率为 **76%**\n- 薄弱知识点：立体几何、数列\n- 已掌握知识点：函数、三角函数\n\n建议多练习立体几何相关的题目来提升薄弱环节。',
    metadata: {
      type: 'statistics',
      data: {
        total_questions: 25,
        success_rate: 0.76
      }
    }
  };
};

const handleMemory = async (userMessage) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    content: '你的学习记忆中有以下内容：\n\n**最近解题记录：**\n1. 函数最值问题 - ✅ 成功\n2. 等比数列求公比 - ✅ 成功\n3. 立体几何证明 - ❌ 失败\n\n**薄弱知识点：**\n- 立体几何（成功率 50%）\n- 数列（成功率 60%）\n\n建议针对这些薄弱点进行专项练习。',
    metadata: null
  };
};
