## RePI

Re=reasoning  
PI=python interpreter

RePI=ReAct结构将Act节点换为PI节点；

- Re节点用于进行数学推理和计算代码编写
- PI节点用于执行python代码并进行计算

Flow流向:
![img.png](../../images/RePI.png)

batchrun.py：按顺序解答指定数据集中的题目，并与题目答案进行比较，详见文件中注释

后端Agent使用:

1. 在.env文件中设置IDEALAB_API_KEY为自己的key,
   获取网站:https://idealab.alibaba-inc.com/ideaTalk#/aistudio/manage/personalResource;  
   设置MODEL_NAME=qwen2.5-max,或者其他idealLAB上提供的模型:https://idealab-models.io.alibaba-inc.com/;
2. 可直接在flow.py下进行整体流程测试