from openai import OpenAI, AsyncOpenAI, OpenAIError
import os
from dotenv import load_dotenv
import asyncio

load_dotenv()

#API_LIST = os.getenv('API_LIST','')

class Pooling():
    def __init__(self, API_LIST, BASE_URL):
        self.api = API_LIST
        self.idx = 0
        self.list_len = len(API_LIST)
        self.base_url = BASE_URL
        self.client = []

        for _ in self.api:
            client = OpenAI(
                # 若没有配置环境变量，请用ideaLAB的API Key将下行替换为：api_key="xxx",
                api_key=_,
                base_url=self.base_url,
            )
            self.client.append(client)

    def call_llm_core(self, prompt):
        response = self.client[self.idx].chat.completions.create(
            model=os.getenv('MODEL_NAME'),
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )

        self.idx = (self.idx + 1) % self.list_len

        return response.choices[0].message.content

    def call_llm_stream_core(self, prompt):
        # 设置 stream=True 开启流式响应
        response = self.client[self.idx].chat.completions.create(
            model=os.getenv('MODEL_NAME'),
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            stream=True
        )

        self.idx = (self.idx + 1) % self.list_len

        # 拼接流式输出内容
        full_content = ""
        for chunk in response:
            # chunk.choices[0].delta.content 可能为 None（stream首块只有role），需判断
            delta = chunk.choices[0].delta
            if hasattr(delta, "content") and delta.content:
                print(delta.content, end="", flush=True)  # 实时输出
                full_content += delta.content
        print()  # 换行（可选）
        return full_content

    def call_llm(self, prompt, attempt=0):
        attempt = attempt
        try:
            return self.call_llm_core(prompt)
        except OpenAIError as e:
            attempt += 1
            if(attempt == self.list_len):
                print("所有api均调用失败，退出执行")
                raise OpenAIError("所有api均调用失败，退出执行")
            print(f"{self.idx}号api调用失败，报错：{e}")
            print(("直接调用下一个api"))
            self.idx = (self.idx + 1) % self.list_len
            return self.call_llm(prompt, attempt)

    def call_llm_stream(self, prompt, attempt=0):
        attempt=attempt
        try:
            return self.call_llm_stream_core(prompt)
        except OpenAIError as e:
            attempt += 1
            if(attempt == self.list_len):
                print("所有api均调用失败，退出执行")
                raise  OpenAIError("所有api均调用失败，退出执行")
            print(f"{self.idx}号api调用失败，报错：{e}")
            print(("直接调用下一个api"))
            self.idx = (self.idx + 1) % self.list_len
            return self.call_llm_stream(prompt)


if __name__ == "__main__":
    base_url = "https://idealab.alibaba-inc.com/api/openai/v1"
    api_list = ['6863cb01636cb3dac9ef5d3525ae6404']
    pooling_ideallab = Pooling(API_LIST=api_list, BASE_URL=base_url)

    pooling_ideallab.call_llm_stream("请50字介绍原神")
