# Agent Shared Memory System - 共享记忆系统

> 让 AI Agent 的多个渠道（控制面板/飞书/微信等）共享同一份记忆和任务板

## 核心原理

### 问题根源
OpenClaw 中，每个 Agent 的不同渠道会创建独立的 session：
- 控制面板 → `agent:xxx:main`
- 飞书私聊 → `agent:xxx:feishu:direct:xxx`
- 飞书群聊 → `agent:xxx:feishu:group:xxx`

这些 session 彼此隔离，历史记录不共享，导致：
- ❌ 控制面板布置的任务，飞书 Agent 看不到
- ❌ 飞书确认的工作，控制面板 Agent 不知道
- ❌ 每个渠道都是"失忆"的孤岛

### 解决方案
通过共享 workspace 文件实现跨渠道记忆同步：

```
控制面板 Agent ←→ workspace/memory/TASKS.md ←→ 飞书 Agent
                          ↑
                    所有渠道共享
```

## 快速安装

### 自动安装（推荐）
```bash
# 在 Kai 工作区执行
npx ts-node scripts/setup.js --agent=yoyo
```

### 手动安装
1. 创建共享目录：`workspace/memory/`
2. 创建任务板：`workspace/memory/TASKS.md`
3. 创建上下文：`workspace/memory/CONTEXT.md`
4. 更新 SOUL.md：追加共享记忆协议
5. 创建协议文件：`workspace/PROTOCOL.md`

## 目录结构

```
workspace/
├── memory/
│   ├── TASKS.md       ← 共享任务板（所有渠道共用）
│   └── CONTEXT.md     ← 共享上下文（所有渠道共用）
├── SOUL.md            ← 必须更新，加入共享协议
└── PROTOCOL.md       ← 协议说明文件
```

## 协议规则

### 每次对话开始时（强制执行）
1. **读取** `workspace/memory/TASKS.md`
2. **读取** `workspace/memory/CONTEXT.md`

### 收到任务时（强制执行）
- **立即写入** `TASKS.md`
- 格式：`- [ ] [任务描述] @[来源渠道] @[时间]`

### 回答问题前（强制执行）
- **必须引用** `TASKS.md` 内容
- 在回答开头说明当前任务状态

### 完成任务时（强制执行）
- **立即更新** `TASKS.md`，标记为 ✅ 已完成

## 模板文件

### TASKS.md 格式
```markdown
# [Agent名] 任务追踪

## 🔄 进行中
- [ ]

## ✅ 已完成
- [ ]

## 📋 待办
- [ ]
```

### CONTEXT.md 格式
```markdown
# [Agent名] 共享上下文

## 最新状态
_最后更新时间：_

## 重要上下文
- 
```

## 多 Agent 部署

### 批量部署脚本
```bash
# 所有 Agent 同时部署
npx ts-node scripts/setup.js --all
```

### 单个 Agent 部署
```bash
npx ts-node scripts/setup.js --agent=bobby
npx ts-node scripts/setup.js --agent=nicy
npx ts-node scripts/setup.js --agent=xiaolong
# ...
```

## 工作原理图

```
┌─────────────────────────────────────────────────────────┐
│                    OpenClaw Gateway                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐      ┌──────────────┐                │
│  │ 控制面板     │      │ 飞书 Agent  │                │
│  │ agent:xxx:  │      │ agent:xxx:   │                │
│  │ main        │      │ feishu:xxx   │                │
│  └──────┬───────┘      └──────┬───────┘                │
│         │                       │                         │
│         └───────────┬───────────┘                         │
│                     ↓                                     │
│          ┌──────────────────┐                             │
│          │ workspace/       │                             │
│          │ memory/         │                             │
│          │ TASKS.md        │                             │
│          │ CONTEXT.md       │                             │
│          └──────────────────┘                             │
│                     ↑                                     │
│         ┌───────────┴───────────┐                        │
│         ↓                       ↓                         │
│  ┌──────────────┐      ┌──────────────┐                 │
│  │ 微信 Agent    │      │ 其他渠道...  │                 │
│  └──────────────┘      └──────────────┘                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 适用场景

- ✅ 多渠道运营团队（控制面板 + 飞书 + 微信）
- ✅ 需要任务追踪的 Agent 系统
- ✅ 分布式 AI 协作团队
- ✅ 需要统一记忆的企业 AI Agent

## 注意事项

1. **所有 Agent 必须遵守协议**：不读取 TASKS.md 就不回答问题
2. **统一文件路径**：所有渠道使用完全相同的路径
3. **即时同步**：任务变更必须立即写入文件
4. **格式规范**：保持 TASKS.md 格式一致

## 版本历史

- v1.0 (2026-03-29) - 初始版本，解决飞书/控制面板记忆同步问题

---

**作者：** Kai ⚡  
**许可证：** MIT  
**适用版本：** OpenClaw 2026.3+
