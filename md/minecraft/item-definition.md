<br>

家人们！谁能懂啊！11月6日晚上11点，我的世界居然发布新快照！美好的睡觉时间直接被掐断了，群里的死鱼们又开始活跃了！家人们，咱们心心念念的资源包在十年后终于等来了他应有的更新，CIT也是半截入土了！但是啊家人们咱们还不能停，继续冲直到他把实体模型吐出来的那一天！

首先是资源包版本号 pack_format 更改为 44
跳过小修小改，咱们先从原版例子研究，最后再写个总结

<br>

***

<a id="to2"><h3>原版例子1</h3></a>

````json
give @s pufferfish 1
give @s pufferfish[item_model="minecraft:pufferfish"] 1
````

这样做你能获得一个使用原版定义的刺豚。
item_model 为该物品在资源包中的定义文件路径，打开该文件你将看到一个最简单的定义文件，内容如下。

````json
# assets/minecraft/items/pufferfish.json
{
    "model": {
        "type": "minecraft:model",
        "model": "minecraft:item/pufferfish"
    }
}
````

其中 model 后面的值，minecraft:item/pufferfish，为该情况下在资源包中所对应使用的模型文件，此示例文件路径为 assets/minecraft/models/item/pufferfish.json
这部分是老东西了，不过多介绍。<br>


此次变动使以往那些通过引用方块模型进行显示的物品模型，既物品模型文件 models/item/diamond_block 里面 parent 指向方块模型文件 models/block/diamond_block 这样的做法被优化掉。判断物品模型使用什么模型，先翻其定义文件。

<br>

***

<h1>施工中。剩下的有空补上...另外该文的创建时间跨度较大，存在错误或建议望指正 谢谢各位</h1>