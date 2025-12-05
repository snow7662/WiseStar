import os

CHUNK_SIZE = 500
CHUNK_OVERLAP = 100
ENCODING = "utf-8"
DB_MODE = "dense"
EMBEDDING_DIM = 1024
TOP_K = 5
TOP_N = 3
CHUNK_SIZE_K = 5

# 嵌入模型配置
EMBEDDING_PROVIDER = "ollama"  # 支持 "ollama", "dashscope", "openai"
# EMBEDDING_PROVIDER = "dashscope"  # 使用阿里云DashScope (需要DASHSCOPE_API_KEY)
# EMBEDDING_PROVIDER = "openai"     # 使用OpenAI (需要OPENAI_API_KEY)
