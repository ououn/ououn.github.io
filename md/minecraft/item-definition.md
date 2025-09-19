<br>

家人们！谁能懂啊！11月6日晚上11点，我的世界居然发布新快照！美好的睡觉时间直接被掐断了，群里的死鱼们又开始活跃了！家人们，咱们心心念念的资源包在十年后终于等来了他应有的更新，CIT也是半截入土了！但是啊家人们咱们还不能停，继续冲直到他把实体模型吐出来的那一天！

hmmm，本来是想写较全面的教程的，但这几天想想都有生成网站了，讲一下结构就好。那么不废话，下面请听题<br>

<br>
<br>

这次改动的思路是通过nbt对物品进行定义，定义文件通过情况判断出特定情况下所渲染的模型。<br>
另一方面 `"type":"minecraft:composite"` 的出现，暂时弥补了原版模型旋转限制的痛，见后。<br>

<br>

小总结<br>
- **物品定义** - 原版默认存在或物品组件 item_model 中指定的物品定义，指向一个定义文件
  - 书写格式为 `<命名空间:路径/物品定义>`
  - 例 `give @s pufferfish[item_model="minecraft:pufferfish"] 1`
  - 指向资源包内路径文件 `/assets/minecraft/items/pufferfish.json`
- **定义文件** - 物品在特定情况下检测通过时使用的模型，指向一个或多个相应的物品模型文件
- **物品模型** - 包含模型的形状数据信息。默认存放于 `/assets/minecraft/models/item 或 block/<模型文件.json>`


<br>

***

<a id="to2"><h3>获取物品</h3></a>

`give @s pufferfish[item_model="<命名空间>:路径/物品定义"] 1`

获取一个使用特定物品定义的河豚物品

<br>

***

<a id="to3"><h3>定义方式 - item model type</h3></a>

<br><a id="to4">**模型** `minecraft:model`</a>
<br>朴实无华，指向一个json格式的物品或方块模型
- 指向资源包中的 `/assets/<命名空间>/models/<模型路径文件>`
````json
{
  "model": {
    "type": "minecraft:model",
    "model": "<命名空间>:<模型路径文件>"
  }
}
````
<hr class="slim-hr">

<br><a id="to5">**特殊模型** `minecraft:special`</a>
<br>实体方块类型，部分实体方块拥有特定的数值可供检测或定义
- 特殊模型的类型和可附加字段，见 <a href="https://minecraft.wiki/w/Items_model_definition#special" target="_blank">wiki</a>
````json
{
  "model": {
    "type": "minecraft:special",
    "base": "<命名空间>:<实体方块模型路径>",
    "model": {
      "type": "<特殊模型类型>",
      "<可附加字段>": <值>
    }
  }
}
````

例：半开的黑色潜影盒
````json
{
  "model": {
    "type": "minecraft:special",
    "base": "minecraft:item/black_shulker_box",
    "model": {
      "type": "minecraft:shulker_box",
      "openness": 0.5
    }
  }
}
````
<hr class="slim-hr">

<br><a id="to6">**组合渲染** `minecraft:composite`</a>
<br>渲染多个模型
- 甚至能在 普通物品模型、图生片状模型的`generated`、特殊模型 之间进行混合
- 配合物品模型的display设置，可以*无视*旋转轴与角度限制
````json
{
  "model": {
    "type": "minecraft:composite",
    "models": [
      { "type": <定义方式>, ... },
      { ... },
      { ... }
    ]
  }
}
````

例：由三个部件组合的物品模型，其中的第二个部分会在此物品于快捷栏被选中时呈现为花开模型
````json
{
  "model": {
    "type": "minecraft:composite",
    "models": [
      { "type": "minecraft:model", "model": "uin:hatframe" },
      {
        "property": "minecraft:selected",
        "type": "minecraft:condition",
        "on_true": {
          "type": "minecraft:model",
          "model": "uin:hatdeco/flower_on"
        },
        "on_false": {
          "type": "minecraft:model",
          "model": "uin:hatdeco/flower_off"
        }
      },
      { "type": "minecraft:model", "model": "uin:hatframe2" }
    ]
  }
}
````
<hr class="slim-hr">

<br><a id="to7">**属性判断（布尔值）** `minecraft:condition`</a>
<br>根据填写的属性 `property`，在其通过时使用 `on_true` 定义下的模型，不通过时使用 `on_false`
````json
{
  "model": {
    "property": "<布尔值属性>",
    "type": "minecraft:condition",
    "on_true": {
        "type": <定义方式>, ...
    },
    "on_false": {
        "type": <定义方式>, ...
    }
  }
}
````

例：按下使用键 `key.use` 时物品模型显示为激活的红石灯
- keybind ID 见wiki的 <a href="https://minecraft.wiki/w/Controls#Configurable_controls" target="_blank">这页面</a>，<a href="https://minecraft.wiki/w/Key_codes" target="_blank">和这页面</a>
````json
{
  "model": {
    "property": "minecraft:keybind_down",
    "keybind": "key.use",
    "type": "minecraft:condition",
    "on_true": {
      "type": "minecraft:model",
      "model": "minecraft:block/redstone_lamp_on"
    },
    "on_false": {
      "type": "minecraft:model",
      "model": "minecraft:block/redstone_lamp"
    }
  }
}
````
<hr class="slim-hr">


- `minecraft:select` - 根据属性的字串，选用对应模型。与 `cases when`、`fallback` 一同使用
- `minecraft:range_dispatch` - 根据属性的数值，从小于或等于此值的最后一项选项中选用对应模型。与 `entries threshold`、`fallback` 一同使用。与旧版的 `overrides` 等价
- `minecraft:bundle/selected_item` - 用于使收纳袋显示当前所选的模型






````json
# 这样做你能获得一个使用原版定义的河豚
give @s pufferfish 1
give @s pufferfish[item_model="minecraft:pufferfish"] 1
````

<br>

`item_model` 为该物品在资源包中的定义文件路径<br>
完整路径为 `/assets/<命名空间>/items/<物品定义.json>`<br>
以河豚为例，打开该文件你将看到一个最简单的物品定义，文件路径与内容如下<br>

````json
# /assets/minecraft/items/pufferfish.json
{
    "model": {
        "type": "minecraft:model",
        "model": "minecraft:item/pufferfish"
    }
}
````

其中 `model` 后面的值 `minecraft:item/pufferfish`，为该情况下在资源包中所对应使用的模型文件，此示例路径则指向模型文件 `/assets/minecraft/models/item/pufferfish.json`<br>
这部分是老东西，不过多介绍。

<br>

***

<a id="to3"><h3>原版例子 2</h3></a>

````json
# 示例代码取自皮革裤子，精简处理以方便讲解
# assets/minecraft/items/leather_leggings.json
{
    "model": {
        "property": "minecraft:trim_material",
        "type": "minecraft:select",
        "cases": [
            {
                "when": "minecraft:quartz",
                "model": {
                    "type": "minecraft:model",
                    "model": "minecraft:item/leather_leggings_quartz_trim",
                    "tints": [
                        { "type": "minecraft:dye", "default": -6265536 }
                    ]
                }
            },
            {
                "when": "minecraft:resin",
                "model": {
                    "type": "minecraft:model",
                    "model": "minecraft:item/leather_leggings_resin_trim",
                    "tints": [
                        { "type": "minecraft:dye", "default": -6265536 }
                    ]
                }
            }
        ],
        "fallback": {
            "type": "minecraft:model",
            "model": "minecraft:item/leather_leggings",
            "tints": [
                { "type": "minecraft:dye", "default": -6265536 }
            ]
        }
    }
}
````

- 大致情况为
    - 因为纹饰材料 `property:trim_material` 为字串属性，所以使用 `minecraft:select`
        - `minecraft:select` 的使用跟随使用 `case` 和 `when`
    - 根据纹饰材料的属性，决定模型使用情况
    - 石英，使用模型 `minecraft:item/leather_leggings_quartz_trim`
    - 树脂，使用模型 `minecraft:item/leather_leggings_resin_trim`
    - 以上情况不符合时的后备情况 `fallback`，使用模型 `minecraft:item/leather_leggings`
- 并且这几种情况均定义了物品当前不存在染色值时，使用 `-6265536` 为默认染色值

<br>

可看出从最简单的定义方式 `"type":"minecraft:model"`
````json
{
    "model": {
        "type": "minecraft:model",
        "model": "<命名空间>:<模型路径>"
    }
}
````
伴随着判断属性 `property` 的出现，首条的定义方式变为 `"type":"minecraft:select"`<br>
并在判断案例 `cases` 中重新写回定义方式 `"type":"minecraft:model"`
````json
{
    "model": {
        "property": <属性>,
        "type": "minecraft:select",
        "cases": [
            {
                "when": <属性情况1>,
                "model": {
                    "type": "minecraft:model",
                    "model": <模型路径>
                }
            },
            {
                "when": [<属性情况2>, <属性情况3>, <属性情况4>],
                "model": ...
            }
        ],
        "fallback": {
            "type": "minecraft:model",
            "model":  <模型路径>
        }
    }
}
````

<br>

***

<a id="to4"><h3>学习例子 3</h3></a>

最后再丢略复杂的例子
````json
{
    "model": {
        "property": "display_context",
        "type": "minecraft:select",
        "cases": [
            {
                "when": [ "head", "fixed" ],
                "model": {
                    "type": "minecraft:composite",
                    "models": [
                        {
                            "type": "minecraft:model",
                            "model": "uin:hatframe"
                        },
                        {
                            "property": "minecraft:custom_model_data",
                            "type": "minecraft:select",
                            "cases": [
                                {
                                    "when": "flower",
                                    "model": {
                                        "type": "minecraft:model",
                                        "model": "uin:accessary/flower"
                                    }
                                }
                            ]
                        },
                        {
                            "property": "minecraft:custom_model_data",
                            "type": "minecraft:select",
                            "cases": [
                                {
                                    "when": "halo",
                                    "model": {
                                        "type": "minecraft:model",
                                        "model": "uin:accessary/halo"
                                    }
                                }
                            ]
                        },
                        {
                            "property": "minecraft:damage",
                            "type": "minecraft:range_dispatch",
                            "entries": [
                                {
                                    "model": { "type": "minecraft:model", "model": "uin:accessary/bunnyear_0" },
                                    "threshold": 0.25
                                },
                                {
                                    "model": { "type": "minecraft:model", "model": "uin:accessary/bunnyear_1" },
                                    "threshold": 0.5
                                },
                                {
                                    "model": { "type": "minecraft:model", "model": "uin:accessary/bunnyear_2" },
                                    "threshold": 0.75
                                }
                            ],
                            "fallback": {
                                "type": "minecraft:model",
                                "model": "uin:accessary/bunnyear"
                            }
                        }
                    ]
                }
            }
        ],
        "fallback": {
            "property": "minecraft:carried",
            "type": "minecraft:condition",
            "on_true": {
                "type": "minecraft:model",
                "model": "uin:doll/icon_carried"
            },
            "on_false": {
                "property": "minecraft:selected",
                "type": "minecraft:condition",
                "on_true": {
                    "type": "minecraft:model",
                    "model": "uin:doll/icon_smile"
                },
                "on_false": {
                    "type": "minecraft:model",
                    "model": "uin:doll/icon_default"
                }
            }
        }
    }
}
````

<br>

***

<a id="to5"><h3>格式框架</h3></a>

<details open>
<summary><b>定义方式 - item model type</b></summary>

- `minecraft:model` - 朴实无华，指向一个json格式的物品/方块模型
- `minecraft:special` - 特殊模型，大多是实体方块，拥有特定的数值可供检测
- `minecraft:composite` - 渲染多个模型
- `minecraft:condition` - 根据属性的布尔值，在 `condition` 下，判断 `on_true` 和 `on_false` 并选用对应模型
- `minecraft:select` - 根据属性的字串，选用对应模型。与 `cases when`、`fallback` 一同使用
- `minecraft:range_dispatch` - 根据属性的数值，从小于或等于此值的最后一项选项中选用对应模型。与 `entries threshold`、`fallback` 一同使用。与旧版的 `overrides` 等价
- `minecraft:bundle/selected_item` - 用于使收纳袋显示当前所选的模型
</details>

<details close>
<summary><b>特殊模型类型 - special model type</b></summary>

- `minecraft:bed`
- `minecraft:banner`
- `minecraft:conduit`
- `minecraft:chest`
- `minecraft:head`
- `minecraft:shulker_box`
- `minecraft:shield`
- `minecraft:trident`
- `minecraft:decorated_pot`
</details>

<details close>
<summary><b>染色源类型 - tint source type</b></summary>

大多数从物品组件中获取RBG值，详情见 <a href="https://zh.minecraft.wiki/w/24w45a" target="_blank">wiki</a><br>
- `minecraft:constant` - 使用 `R*255*255+G*255+B`，或 `[R, G, B]` 格式的RGB值
- `minecraft:dye` - 从物品组件 `minecraft:dyed_color` 或不存在时使用默认值
- `minecraft:grass` - 根据群系温度与湿度，从 `textures/colormap/grass.png` 中定位并获取对应值
- `minecraft:firework` - 从物品组件 `minecraft:firework_explosion` 中或不存在时使用默认值
- `minecraft:potion` - 从物品组件 `minecraft:potion_contents` 中根据情况获取或计算出RGB值
- `minecraft:map_color` - 从物品组件 `minecraft:map_color` 中或不存在时使用默认值
- `minecraft:custom_model_data` - 从物品组件 `minecraft:custom_model_data` 中获取对应值
</details>


<details close>
<summary><b>属性（布尔值）- boolean property</b></summary>

根据属性的true/false情况，确定使用 `on_true` 或 `on_false` 模型，详情见 <a href="https://zh.minecraft.wiki/w/24w45a" target="_blank">wiki</a><br>
- `minecraft:using_item` - 如格挡中、食用中时通过。结合物品组件 `consumable` 使用效果更佳
- `minecraft:broken`
- `minecraft:damaged`
- `minecraft:has_component`
- `minecraft:fishing_rod/cast`
- `minecraft:bundle/has_selected_item`
- `minecraft:xmas` - 仅在圣诞节及前后一天通过
- `minecraft:selected` - 于快捷栏内被选中时通过
- `minecraft:carried` - 鼠标抓住物品且未放下时通过
- `minecraft:shift_down` - 按下 shift 键时，无论是躺地上、旁观模式、聊天输入中、甚至是ESC界面都能通过！
- `minecraft:custom_model_data`
</details>

<details close>
<summary><b>属性（字串） - property</b></summary>

- `minecraft:main_hand` - 此处的属性为玩家客户端皮肤设置中对主手的左右设置，并非单纯游戏中的主副手。等价于旧版 `overrides` 中的 `lefthanded`
- `minecraft:charge_type`
- `minecraft:trim_material`
- `minecraft:block_state`
- `minecraft:display_context` - 根据渲染的位置返回相应值
- `minecraft:custom_model_data`
</details>

<details close>
<summary><b>属性（数字）- numeric property</b></summary>

根据属性的数值，从小于或等于此值的最后一项选项中选用对应模型。与 `entries` 和 `threshold` 一同使用。与旧版的 `overrides` 等价<br>
详情见 <a href="https://zh.minecraft.wiki/w/24w45a" target="_blank">wiki</a><br>
- `minecraft:custom_model_data`
- `minecraft:bundle/fullness`
- `minecraft:damage`
- `minecraft:count`
- `minecraft:cooldown`
- `minecraft:time`
- `minecraft:compass`
- `minecraft:crossbow/pull`
- `minecraft:use_duration`
- `minecraft:use_cycle`
</details>

<hr class="slim-hr">

???

***

<h1>施工中。剩下的有空补上...存在错误或建议望指正 谢谢各位</h1>