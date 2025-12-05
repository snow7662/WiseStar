from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import uvicorn

from config import config
from llm_client import llm_client
from python_executor import python_executor
from prompts import *

app = FastAPI(title="WiseStar-MathAgent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SolveRequest(BaseModel):
    question: str

class GenerateRequest(BaseModel):
    difficulty_level: str = "中等"
    problem_type: str = "函数"
    topic_keywords: List[str] = []
    requirements: str = ""

class PlotExecuteRequest(BaseModel):
    code: str

class PlotGenerateRequest(BaseModel):
    description: str

@app.get("/")
async def root():
    return {"message": "WiseStar-MathAgent API Server", "version": "1.0.0"}

@app.post("/solve")
async def solve_problem(request: SolveRequest):
    try:
        user_prompt = SOLVE_USER_PROMPT.format(question=request.question)
        result = llm_client.call(SOLVE_SYSTEM_PROMPT, user_prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate")
async def generate_question(request: GenerateRequest):
    try:
        user_prompt = GENERATE_USER_PROMPT.format(
            difficulty_level=request.difficulty_level,
            problem_type=request.problem_type,
            topic_keywords=", ".join(request.topic_keywords),
            requirements=request.requirements
        )
        result = llm_client.call(GENERATE_SYSTEM_PROMPT, user_prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/statistics")
async def get_statistics():
    return {
        "total": 0,
        "success_rate": 0.0,
        "weak_points": [],
        "mastered_points": [],
        "weekly_data": []
    }

@app.get("/memory")
async def get_memory(tag: Optional[str] = None, difficulty: Optional[str] = None):
    return {
        "total": 0,
        "records": []
    }

@app.get("/daily")
async def get_daily_question():
    return {
        "date": "2025-01-20",
        "question": "暂无每日一题",
        "tags": [],
        "difficulty": "中等",
        "source": "系统",
        "strategy": "balanced",
        "answer": "",
        "hint": ""
    }

@app.post("/daily/submit")
async def submit_daily_answer(questionId: int, answer: str):
    return {
        "success": True,
        "correct": True,
        "feedback": "答案正确"
    }

@app.post("/plot/execute")
async def execute_plot(request: PlotExecuteRequest):
    try:
        result = python_executor.execute(request.code)
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/plot/generate")
async def generate_plot_code(request: PlotGenerateRequest):
    try:
        user_prompt = PLOT_GENERATE_USER_PROMPT.format(description=request.description)
        result = llm_client.call(PLOT_GENERATE_SYSTEM_PROMPT, user_prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host=config.API_HOST, port=config.API_PORT)
