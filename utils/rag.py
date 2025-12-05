import os
from openai import OpenAI
from dotenv import load_dotenv

import dashscope
from http import HTTPStatus

load_dotenv()


# print(os.getenv("DASHSCOPE_API_KEY"))

def get_embedding(texts, dimensions=1024, model_provider="dashscope"):
    """
    输入:
        texts: List[str] 待计算embedding的文本列表
        dimensions: int   向量维度
        model_provider: str 模型提供商，支持 "dashscope", "ollama", "openai"
    输出:
        List[List[float]]，每个文本的embedding向量
    """
    if model_provider == "ollama":
        # 使用本地Ollama服务 (BGE-M3)
        client = OpenAI(
            api_key="ollama",  # ollama不需要真实API key
            base_url="http://localhost:11434/v1"
        )
        response = client.embeddings.create(
            model="bge-m3",
            input=texts
        )
    elif model_provider == "openai":
        # 使用OpenAI官方API
        client = OpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )
        response = client.embeddings.create(
            model="text-embedding-3-large",
            input=texts,
            dimensions=dimensions
        )
    else:  # dashscope (默认)
        # 使用阿里云DashScope
        client = OpenAI(
            api_key=os.getenv("DASHSCOPE_API_KEY"),
            base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
        )
        response = client.embeddings.create(
            model="text-embedding-v4",
            input=texts,
            dimensions=dimensions,
            encoding_format="float"
        )

    # 提取每个embedding
    try:
        # 兼容OpenAI风格，通常为response.data[i].embedding
        embeddings = [item.embedding for item in response.data]
    except Exception as e:
        raise RuntimeError(f"Get embedding failed with {model_provider}: {e}\nResponse: {response}")
    return embeddings


def rerank(question, docs, top_n):
    """
    计算top k docs相对于question的相关性分数，然后按分数排序，返回top n个文档文本

    :param question: str，问题
    :param docs: List[str]，待排序的候选文档
    :param top_n: int，返回前top_n个
    :return: reranked_docs: List[str]，按分数降序排序的文本列表
    """
    resp = dashscope.TextReRank.call(
        api_key=os.getenv("DASHSCOPE_API_KEY"),
        model="gte-rerank-v2",
        query=question,
        documents=docs,
        top_n=top_n,  # API会返回分最高的top_n个
        return_documents=True
    )
    if resp.status_code == HTTPStatus.OK:
        # 结果已经按照相关性排序
        reranked_docs = [item['document']['text'] for item in resp['output']['results']]
    else:
        # 出错时可自定义异常/降级处理，这里简单返回原文档
        reranked_docs = docs[:top_n]
    return reranked_docs


# 示例用法
if __name__ == "__main__":
    print("embed test===================")
    texts = [
        '风急天高猿啸哀',
        '渚清沙白鸟飞回',
        '无边落木萧萧下',
        '不尽长江滚滚来'
    ]

    # 测试不同的embedding提供商
    providers_to_test = [
        ("ollama", "本地BGE-M3"),
        ("dashscope", "阿里云DashScope"),
        # ("openai", "OpenAI官方")  # 需要OPENAI_API_KEY
    ]

    for provider, description in providers_to_test:
        try:
            print(f"\n--- 测试{description} ({provider}) ---")
            vecs = get_embedding(texts, 1024, model_provider=provider)
            print(f"返回向量数: {len(vecs)}")
            print(f"每个向量长度: {len(vecs[0]) if vecs else 'N/A'}")
            if vecs and len(vecs[0]) >= 10:
                print(f"第一个向量前10维: {vecs[0][:10]}")
        except Exception as e:
            print(f"❌ {description}测试失败: {e}")
    print("\nrerank test====================")

    # 只在有API key时测试rerank
    if os.getenv("DASHSCOPE_API_KEY"):
        question = "什么是文本排序模型"
        docs = [
            "文本排序模型广泛用于搜索引擎和推荐系统中，它们根据文本相关性对候选文本进行排序",
            "量子计算是计算科学的一个前沿领域",
            "预训练语言模型的发展给文本排序模型带来了新的进展"
        ]
        try:
            result = rerank(question, docs, 2)
            print(f"Rerank结果: {result}")
        except Exception as e:
            print(f"❌ Rerank测试失败: {e}")
    else:
        print("⚠️ 跳过rerank测试 - 未设置DASHSCOPE_API_KEY")
