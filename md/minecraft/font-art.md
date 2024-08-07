<br>

在我的世界Java版1.13更新的命令格式大巨变之余，官方还悄咪咪地添加了这么一个小功能。使制作者可以通过资源包修改所使用的字体，或是指定某个字符显示时所使用的贴图。听着朴实无华，实则是方块人发现了新大陆。
字符所能显示之处皆是潜在的照片展示框。

<details open>
<summary>使用效果</summary>

<div class="simp-imgbox">
    <a class="simp-imgbox-entry" href="https://www.bilibili.com/video/BV16K411g7sm">
        <img class="simp-imgbox-img" src="https://z3.ax1x.com/2021/05/04/gnX0i9.png">
        <p class="simp-imgbox-name">蘑菇秘境Ⅱ by MILENARY</p>
    </a>
    <a class="simp-imgbox-entry">
        <img class="simp-imgbox-img" src="https://z3.ax1x.com/2021/05/04/gnXrxx.gif">
        <p class="simp-imgbox-name">组坑 by 像素立方 — https://www.mcbbs.net/thread-934989-1-1.html</p>
    </a>
    <a class="simp-imgbox-entry" href="https://www.bilibili.com/video/av201570404/">
        <img class="simp-imgbox-img" src="https://z3.ax1x.com/2021/05/04/gnXtqU.png">
        <p class="simp-imgbox-name">BNA by BlackCB.</p>
    </a>
    <a class="simp-imgbox-entry">
        <img class="simp-imgbox-img" src="https://z3.ax1x.com/2021/06/15/2HuGMd.png">
        <p class="simp-imgbox-name">by Nabbie#9286</p>
    </a>
    <a class="simp-imgbox-entry">
        <img class="simp-imgbox-img" src="https://z3.ax1x.com/2021/05/04/gnXDR1.png">
        <p class="simp-imgbox-name">MineClub 服务器</p>
    </a>
    <a class="simp-imgbox-entry" href="https://www.youtube.com/watch?v=ZoIXD0Tz6qE">
        <img class="simp-imgbox-img" src="https://z3.ax1x.com/2021/05/04/gnXBGR.png">
        <p class="simp-imgbox-name">国外地图 哈利波特 by The Floo Network</p>
    </a>
</div>

</details>

接下来是（**主要围绕bitmap的**）教程和相关资料，不带废话，因此要求读者对资源包有一定的了解。

<br>

***

<a id="to2"><h3>基本制作流程</h3></a>

1. 资源包 assets\minecraft\font 位置下新建文件 default.json
	- 命名为 default 则为游戏默认使用的字体配置，资源包加载后便会立刻适用
	- 若命名 default 以外的名字，则视为另一套字体配置加载到游戏中
2. 打开该 json 文件，输入的内容见下
3. 根据 json 内填写的路径放入所需的文件
4. 选用资源包并确保 强制使用Unicode字体 为 关

<hr class="slim-hr">

<h3>Json 内容 & 解释</h3>
自定义字体的类型目前支持以下三种：ttf，legacy_unicode，bitmap。按需选一，可混搭<br><br>

<details><summary>ttf —— True Type Font | 电脑中主流的字体格式。游戏目前不使用ttf字体，但可以通过资源包启用</summary>

````json
{
    "providers":[
        {
            "type":"ttf",
            "file":"minecraft:arial.ttf",
            "shift":[0.0,0.0],
            "size":11.0,
            "oversample":2.0,
            "skip":"ouOU"
                        
        }
    ]
}
````

- type —— 字体类型
- file —— ttf文件位置
	- "minecraft:arial.ttf" 为例，则应有字体文件 assets/minecraft/font/arial.ttf
	- "foo:bar/sweet.ttf" 为例，则应有字体文件 assets/foo/font/bar/sweet.ttf
- shift —— 对字体的全局调整。首个值调整左右（正值往右），第二个值调整上下（正值往下）。默认为[0,0]
- size —— 字体的像素大小。默认为11.0
- oversample —— 采样率。提升该值可使字体渲染时更为精确。默认为2.0
- skip —— 该字体文件将不应用于哪些字符

![](https://s2.ax1x.com/2019/12/27/lZmjP0.png)

<hr class="exslim-hr">
</details>



<details><summary>legacy_unicode —— 万国码 | 包含范围 u0000 ~ uffff。但不包含 u0800 ~ u08ff，代理对 ud800 ~ udfff 和 私用区 ue000 ~ uf8ff</summary>

````json
{
    "providers":[
        {
            "type":"legacy_unicode",
            "sizes":"minecraft:font/glyph_sizes.bin",
            "template":"minecraft:font/unicode_page_%s.png"
        }
    ]
}
````

- type —— 字体类型
- sizes —— bin文件位置。该glyph_sizes.bin文件记录着字符的调整信息。部分unicode字体生成器会顺手生成此文件
	- "minecraft:font/glyph_sizes.bin" 为例，则应有文件 assets/minecraft/font/glyph_sizes.bin
- template —— png文件位置。%s将会自动识别为对应页码
	- "minecraft:font/unicode_page_%s.png" 为例，则贴图文件应保存在 assets/minecraft/textures/font/ 下。 unicode_page_00,unicode_page_0a ... unicode_page_ff

*建议直接修改原有的贴图，根本不需要来这里做改动<br>
*通过这种方法制作多套字体还是可以的，和以前改unicode_page一样，没什么特别要提到的，因此不过多介绍<br>
因为只在 强制使用Unicode 开启时才会优先使用，所以若该字在 bitmap 中也有定义，可以做到开启 强制使用 时显示这一套，而关闭时显示隔壁那套

<hr class="exslim-hr">
</details>



<details><summary>bitmap —— 位图 | （本文重点）</summary>

````json
{
    "providers":[
        {
            "type":"bitmap",
            "file":"uin:debug/page1_256x.png",
            "height":256,
            "ascent":256,
            "chars":["\ue001"]
        },
        {
            "type":"bitmap",
            "file":"uin:debug/page2_256x118.png",
            "height":118,
            "ascent":59,
            "chars":[
                "\ue002\u0000\ue003\ue004",
                "\ue005\ue006\ue007\ue008"
            ]
        }
    ]
}
````

- type —— 字体类型
- file —— png文件位置
	- 上面为例，则应有贴图文件 assets/uin/textures/debug/page1_256x.png
- height —— 字符在游戏中显示的像素高度。选填，默认为8
    - 可以为负值，图片将反向缩放，同时影响后续字体的渲染位置
- ascent —— 字符在游戏中往上偏移的像素点
    - 该值不能高于height值
- chars —— 该贴图所包含的字符
    - 可填万国码如示例也可以直接填写目标字符
    - 填写 \u0000 则在贴图切割分配给字符时，忽略该位置

![](https://s2.ax1x.com/2019/12/27/lZnHSK.png)

</details>

<hr class="slim-hr">

<h3>显示字符</h3>
在字体配置文件为 default.json 的情况下，字符会自动显示自定义的字符。也可以在允许输入 json 文本的地方以万国码的方式显示字符。<br><br>

````
#Tellraw & Title
tellraw @p "\ue001\ue002"
tellraw @p [{"text":"\ue001\ue002"}]
title @p title [{"text":"\ue001"}]

#Name/Lore
give @p pufferfish{display:{Name:'{"text":"\\ue001"}',Lore:['{"text":"\\ue002"}']}} 1

#CustomName
#1.13   summon armor_stand ~ ~ ~ {CustomName:"{\"text\":\"\\ue001\"}",CustomNameVisible:1b}
#1.14   summon armor_stand ~ ~ ~ {CustomName:'{"text":"\\ue001"}',CustomNameVisible:1b}
````


修改好的字体在实际应用前往往需要进行偏移甚至是重叠，而这原本是做不到的，直到一个字体相关的bug被发现(见后)...再后来官方出手相助

<br>

***

<a id="to3"><h3>chars ascent height</h3></a>

- chars - 分配贴图到字符时的划分方式
- ascent - 渲染时字符垂直偏移于渲染线的像素距离
- height - 字符在游戏里显示时的像素高度
    - 文本在不同的地方进行渲染时，像素单位可能存在差异，如 title 和 subtitle

![](https://s2.ax1x.com/2020/02/16/3pxjYV.png)
![](https://s2.ax1x.com/2020/02/16/3pxLoq.png)
![](https://s2.ax1x.com/2020/02/16/3pxXF0.png)

<br>

***

<a id="to4"><h3>箱子UI / 菜单栏</h3></a>

全局性修改的话除了老办法直接糊箱子的贴图，也可以修改资源包lang文件夹下所有语言的该翻译词条，使该翻译带有先前自定义的字体字符。

翻译词条的优点是可以使贴图超出原本箱子贴图以外的范围（菜单栏的修改同样使用该方法）<br>
下图为例， **\UF808** 为反向空格的偏移字段，此处作用为把文本打印起始点往左偏移8像素点。<br>
**§F** 则是为字体着白色，以维持后续字体的颜色。例如下面的Inventory默认就被糊了灰色。其他地方也会有为字体默认糊色的情况，比如书本内的字体会糊黑色，注意一下。<br>
最后的 **\U002B** (自定义字符"+")就是此次显示的图片。

![](https://z3.ax1x.com/2021/11/26/oVno5V.png)

由于被命名的箱子在打开时左上角会显示其命名，因此可以做到特定箱子显示特定UI。

````
give @s chest{display:{Name:'{"color":"white","text":"\\UF808\\u002B"}'}}
give @s chest{display:{Name:'[{"translate":"space.-8","color":"white"},"+"]'}}
give @s chest{display:{Name:'{"translate":"custom.container.chest"}'}}
````

<br>

***

<a id="to5"><h3>书</h3></a>

待补充...<br>

<br>

***

<a id="to999"><h3>相关链接</h3></a>

- 教程/介绍
    - <a href="https://zh.minecraft.wiki/w/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AD%97%E4%BD%93" target="_blank">[自定义字体]</a>
    - <a href="https://www.bilibili.com/read/cv8362858/" target="_blank">[为什么我们能看到汉字？]</a>
    - <a href="https://www.youtube.com/watch?v=EL2X6ppZSCQ" target="_blank">[油管 - 制作自定义魔法条的教程]</a>
- 思路/讲解
    - <a href="https://www.bilibili.com/video/BV194411t7Hm" target="_blank">[字体黑科技 – 在MC里玩王国之心]</a>
    - <a href="https://www.bilibili.com/video/BV1SJ411P7Er" target="_blank">[字体黑科技 —— 潜影盒内容预览]</a>
    - <a href="https://www.bilibili.com/video/BV1Qy4y1b7GV" target="_blank">[MC黑科技自定义物品栏-反向空格应用篇]</a>
- 工具
    - <a href="https://github.com/AmberWat/NegativeSpaceFont" target="_blank">[反向空格资源包]</a>
    - <a href="https://github.com/PuckiSilver/NoShadow" target="_blank">[着色器 移除文本阴影]</a>
    - <a href="https://github.com/VisiVersa/Common-Shaders?tab=readme-ov-file#text-offsets-through-color" target="_blank">[着色器 根据屏幕比例偏移文本]</a>
    - <a href="https://github.com/sch246/MCunicode" target="_blank">[MCunicode字体放缩 - 将我的世界的unicode字体格式转化为bitmap格式，并且进行放缩的资源包]</a>

<br>

***

<h1>剩下的有空补上...另外该文的创建时间跨度较大，存在错误或建议望指正 谢谢各位</h1>

<a href="#" target="_blank">[有问题请找狗大师 2324001608]</a>
