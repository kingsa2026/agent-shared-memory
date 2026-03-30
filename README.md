# Agent Shared Memory System

让 AI Agent 的多个渠道共享同一份记忆和任务板

## 问题

OpenClaw 中，每个 Agent 的不同渠道会创建独立的 session：
- 控制面板 -> agent:xxx:main
- 飞书私聊 -> agent:xxx:feishu:direct:xxx
- 飞书群聊 -> agent:xxx:feishu:group:xxx

这些 session 彼此隔离，导致控制面板布置的任务，飞书 Agent 看不到。

## 解决方案

通过共享 workspace 文件实现跨渠道记忆同步：

```
控制面板 Agent <-> workspace/memory/TASKS.md <-> 飞书 Agent
```

## 一键安装

```bash
npx degit kingsa2026/agent-shared-memory agent-shared-memory && cd agent-shared-memory && npx ts-node scripts/setup.js --all
```

## 分步安装

1. 克隆仓库
```bash
git clone https://github.com/kingsa2026/agent-shared-memory.git
cd agent-shared-memory
```

2. 部署所有 Agent
```bash
npx ts-node scripts/setup.js --all
```

3. 重启 Gateway
```bash
openclaw gateway restart
```

## 目录结构

```
workspace/
├── memory/
│   ├── TASKS.md       共享任务板
│   └── CONTEXT.md     共享上下文
├── SOUL.md            已更新，包含共享协议
└── PROTOCOL.md       协议说明
```

## 协议规则

### 每次对话开始时
1. 读取 workspace/memory/TASKS.md
2. 读取 workspace/memory/CONTEXT.md

### 收到任务时
- 写入 TASKS.md
- 格式：- [ ] [任务] @[来源] @[时间]

### 完成任务时
- 更新 TASKS.md，标记为 Done

## 快速验证

部署完成后测试：

**控制面板 -> YOYO：**
```
YOYO，我给你一个新任务：测试共享记忆
```

**飞书 -> YOYO：**
```
YOYO，我刚才给你什么任务？
```

预期结果：飞书 YOYO 应该能回答出控制面板布置的任务！

## 适用场景

- 多渠道运营团队（控制面板 + 飞书 + 微信）
- 需要任务追踪的 Agent 系统
- 分布式 AI 协作团队

## 作者

Kai

## 许可证

MIT
