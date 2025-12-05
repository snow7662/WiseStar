# RePI+Reflect

在RePI（推理&python代码解释器）的基础上引入反思节点，并且将路由选择权转交给Reflect;  
本质上是对RePI中Re节点功能的进一步拆分,增加用于反思的token开销;  
也可以理解为在Reflect Agent流程中,为Re节点增加了调用python解释器的能力;

![img.png](../../images/ReflectPI.png)

## 使用

1. 在.env文件中设置IDEALAB_API_KEY为自己的key,
   获取网站:https://idealab.alibaba-inc.com/ideaTalk#/aistudio/manage/personalResource;  
   设置MODEL_NAME=qwen2.5-max,或者其他idealLAB上提供的模型:https://idealab-models.io.alibaba-inc.com/;
2. 可接在flow.py下进行整体流程测试