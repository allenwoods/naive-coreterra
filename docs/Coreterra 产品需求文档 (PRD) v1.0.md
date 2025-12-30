# Coreterra 产品需求文档 (PRD) v1.0

## 1. 产品概述

Coreterra 是一款融合了 **RPG 游戏化机制** 的 **多人协作 GTD (Getting Things Done)** 工具。旨在通过游戏化的即时反馈（XP、金币、等级）解决传统 GTD 工具枯燥难坚持的问题，并通过团队协作功能提升组织效率。

## 2. 核心数据模型 (Data Model)

核心数据实体设计如下：

### 2.1 用户 (User / Player)

-   **基础信息**: `id`, `name`, `avatar`, `role` (e.g., Dev, Design).
-   **RPG 属性**:
    -   `level` (当前等级)
    -   `currentXP` / `maxXP` (经验值)
    -   `gold` (金币余额)
    -   `streak` (连续登录/完成任务天数)
    -   `attributes`: { `focus`, `execution`, `planning`, `teamwork`, `expertise` } (雷达图属性)
    -   `inventory`: (拥有的道具列表)

### 2.2 任务 (Task)

-   **基础信息**: `id`, `title`, `description`, `createdAt`, `dueDate`.
-   **GTD 状态**: `status` (枚举值: `inbox`, `clarified`, `organized`, `scheduled`, `waiting`, `completed`, `trash`).
-   **分类**: `projectId` (关联项目), `contextId` (关联情境, e.g., @Office).
-   **游戏化估算**:
    -   `difficulty` (难度: Easy, Medium, Hard)
    -   `estimatedTime` (预估时长: 15m, 30m, 1h, 2h+)
    -   `xpReward` (计算得出的 XP 奖励)
    -   `goldReward` (计算得出的金币奖励)
-   **执行**: `subtasks` [{ `id`, `text`, `isDone` }], `progress` (进度百分比).
-   **协作**: `assigneeId` (执行人).

### 2.3 项目 (Project)

-   `id`, `title`, `description`.
-   `progress` (聚合子任务进度).
-   `timeline` (开始/结束时间).

### 2.4 游戏化对象 (Gamification Objects)

-   **成就 (Achievement)**: `id`, `condition`, `badgeIcon`, `isUnlocked`.
-   **商品 (ShopItem)**: `id`, `type` (consumable/cosmetic), `cost`, `effect`.

## 3. 核心用户故事 (Core User Stories)

### 3.1 C.C.O.R.E 工作流 (核心循环)

-   **Capture (收集)**
    -   **US-01**: 用户可以通过全局快捷键 (⌘K) 或快速入口，将任何想法快速存入 "Inbox" (收集箱)，避免打断当前心流。
-   **Clarify (理清)**
    -   **US-02**: 用户在 "Inbox" 中可以逐条处理未分类事项。
    -   **US-03**: 用户在处理任务时，必须定义“做什么(Subtasks)”、“多难(Difficulty)”和“多久(Time)”。系统根据这些参数自动计算该任务的 **XP 和金币奖励**。
-   **Organize (组织)**
    -   **US-04**: 用户可以将任务拖拽分配到特定的项目 (Project)、情境 (Context) 或指派给特定团队成员。
-   **Review (回顾)**
    -   **US-05**: 用户可以通过日/周/月视图回顾已完成的任务，查看自己获得的 XP 总量和属性成长 (如：今日“专注”属性提升了 10 点)。
-   **Engage (执行)**
    -   **US-06**: 用户进入 "Engage Mode" (执行模式)，系统根据预估时间 (如 30m) 筛选出适合当前的任务。
    -   **US-07**: 用户完成子任务时获得即时的微小反馈 (Floating Text)，完成整个任务时获得结算奖励。

### 3.2 团队协作

-   **US-08**: 团队管理者可以在 "Team" 页面查看成员的负载 (Capacity) 和状态 (Available/Busy)，以便合理分配任务。
-   **US-09**: 任务被指派给他人后，状态自动变更为 "Waiting For" (等待中)。

### 3.3 游戏化与激励

-   **US-10**: 用户可以使用赚取的金币在商店购买 "Streak Freeze" (连胜保护) 或 UI 主题。
-   **US-11**: 当用户连续完成任务达到一定天数，获得 "Streak" 勋章展示。

## 4. 核心 UI 组件设计

### 4.1 全局组件

-   **GlobalHeader (全局顶栏)**
    -   包含：Logo、**Capture Input (全局捕获框)**、用户头像 (带等级进度条)、通知铃铛。
    -   *交互重点*：输入框应支持键盘优先操作。
-   **NavigationSidebar (侧边导航)**
    -   结构：Workspace (工作区), Review (回顾), Game (游戏化商店/成就)。
    -   *特点*：高亮当前选中项，移动端自动折叠为底部 TabBar。

### 4.2 功能型组件

-   **InboxProcessor (收件箱处理器)**
    -   **List Mode**: 传统的清单视图，支持批量操作 (Archive/Delete)。
    -   **Process Mode (沉浸式)**: 单卡片视图，强制用户对当前事项进行 "Do It"、"Delegate"、"Schedule" 或 "Clarify" 决策。
-   **ClarifyModal (理清模态框)**
    -   这是 RPG 机制的核心入口。
    -   **Input**: 任务标题、描述。
    -   **Breakdown**: 子任务添加列表。
    -   **Estimator**: 难度选择器 (Easy/Med/Hard) + 时长选择器。
    -   **RewardPreview**: 根据选择动态展示 "Estimated Reward (+50 XP)" 的动画卡片。
-   **EngageWorkspace (执行工作台)**
    -   左侧：任务筛选列表 (按时长筛选：15m, 30m...)。
    -   右侧：当前任务详情。
    -   *交互*：点击子任务复选框时，屏幕浮现 "+10 XP" 动画；完成大任务时触发粒子特效。
-   **TeamGrid (团队网格)**
    -   展示成员卡片，包含头像、角色标签、状态指示灯 (Green/Red) 和 **Capacity Bar (负载进度条)**。

### 4.3 数据可视化组件

-   **ProductivityRadar (能力雷达图)**
    -   位于 Profile 页面，展示用户在 Focus, Execution, Planning 等维度的六边形能力分布。
-   **StreakWidget (连胜挂件)**
    -   位于首页，展示火焰图标和连续天数，点击可消耗金币购买“补签”。

## 5. 总结

Coreterra 的设计精髓在于将 GTD 的 **"下一步行动 (Next Action)"** 定义过程，转化为 RPG 游戏的 **"任务接取 (Quest Acceptance)"** 过程。通过在 `Clarify` 阶段强制用户评估难度，既符合 GTD 明确任务属性的要求，又为游戏化奖励提供了量化依据。