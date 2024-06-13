<br>

在我的世界Java版1.13更新的命令格式大巨变之余，官方还悄咪咪地添加了这么一个小功能。使制作者可以通过资源包修改所使用的字体，或是指定某个字符显示时所使用的贴图。听着朴实无华，实则是方块人发现了新大陆。
字符所能显示之处皆是潜在的照片展示框。

<details>
<summary>使用效果</summary>
<img src="https://z3.ax1x.com/2021/05/04/gnXtqU.png" width="100%" title="BNA by BlackCB. —— https://www.mcbbs.net/thread-1088676-1-1.html">
<img src="https://z3.ax1x.com/2021/05/04/gnXrxx.gif" width="100%" title="组坑 by 像素立方 —— https://www.mcbbs.net/thread-934989-1-1.html">
<a href="https://www.bilibili.com/video/BV16K411g7sm"><img src="https://z3.ax1x.com/2021/05/04/gnX0i9.png" width="100%" title="蘑菇秘境Ⅱ by MILENARY"></a>
<a href="https://www.youtube.com/watch?v=ZoIXD0Tz6qE"><img src="https://z3.ax1x.com/2021/05/04/gnXBGR.png" width="100%" title="国外地图 哈利波特 by The Floo Network"></a>
<img src="https://z3.ax1x.com/2021/05/04/gnXDR1.png" width="100%" title="MineClub 服务器">
<img src="https://z3.ax1x.com/2021/06/15/2HuGMd.png" width="100%" title="by Nabbie#9286">
</details>

接下来是（**主要围绕bitmap的**）教程和相关资料，不带废话，因此要求读者对资源包有一定的了解。

<br>

***

<a id="to2"><h2>基本制作流程</h2></a>

1. 资源包 assets\minecraft\font 位置下新建文件 default.json
	- 命名为 default 则为游戏默认使用的字体配置，资源包加载后便会立刻适用
	- 若命名 default 以外的名字，则视为另一套字体配置加载到游戏中
2. 打开该 json 文件，输入的内容见下
3. 根据 json 内填写的路径放入所需的文件
4. 选用资源包并确保 强制使用Unicode字体 为 关


<h3>Json 内容 & 解释</h3>
自定义字体的类型目前支持以下三种：ttf，legacy_unicode，bitmap。按需选一，可混搭



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
- template —— png文件位置。%s将会自动识别为对应页码。存放位置以 assets/<[i]namespace[/i]>/textures/ 起
	- "minecraft:font/unicode_page_%s.png" 为例，则贴图文件应保存在 assets/minecraft/textures/font/ 下。 unicode_page_00,unicode_page_0a ... unicode_page_ff

*建议直接修改原有的贴图，根本不需要来这里做改动<br>
*通过这种方法制作多套字体还是可以的，和以前改unicode_page一样，没什么特别要提到的，因此不过多介绍<br>
因为只在 强制使用Unicode 开启时才会优先使用，所以若该字在 bitmap 中也有定义，可以做到开启 强制使用 时显示这一套，而关闭时显示隔壁那套

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
- file —— png文件位置。以 assets/<[i]namespace[/i]>/textures/ 起
	- 上面为例，则应有贴图文件 assets/uin/textures/debug/page1_256x.png
- height —— 字符在游戏中显示的像素高度。选填，默认为8
    - 可以为负值，图片将反向缩放，同时影响后续字体的渲染位置
- ascent —— 字符在游戏中往上偏移的像素点
    - 该值不能高于height值
- chars —— 该贴图所包含的字符，可填万国码如示例也可以直接填写目标字符。填写 \u0000 则不读取该位

![](https://s2.ax1x.com/2019/12/27/lZnHSK.png)

</details>


<h1>剩下的有空补上...另外该文的创建时间跨度较大，存在错误或建议望指正 谢谢各位</h1>

<a href="#" target="_blank">[有问题请找狗大师 2324001608]</a>