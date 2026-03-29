/**
 * Agent Shared Memory System - 快速部署脚本
 * 
 * 用法：
 *   npx ts-node setup.js --agent=yoyo     # 部署单个 Agent
 *   npx ts-node setup.js --all             # 部署所有 Agent
 */

const fs = require('fs');
const path = require('path');

// Agent 列表
const AGENTS = ['bobby', 'doudou', 'kai', 'lucy', 'nicy', 'xiaolong', 'xiaoxiami', 'yoyo'];

// SOUL.md 追加的协议内容
const PROTOCOL_SECTION = `

---

## 🚨 SHARED MEMORY PROTOCOL (MANDATORY)

### Every conversation start:
1. READ \`workspace/memory/TASKS.md\`
2. READ \`workspace/memory/CONTEXT.md\`

### When receiving tasks:
- IMMEDIATELY write to \`workspace/memory/TASKS.md\`
- Format: \`- [ ] [task] @[source] @[time]\`

### Before answering:
- MUST quote TASKS.md content in your response
- In your answer header, state: "Based on TASKS.md, you have the following tasks..."

### When completing tasks:
- IMMEDIATELY update TASKS.md as ✅ Done

**This is mandatory! Failure to comply = failure!**
`;

// TASKS.md 模板
const TASKS_TEMPLATE = `# [AGENT] 任务追踪

> 所有任务必须记录，状态变更即时更新
> **统一路径：workspace/memory/TASKS.md**

---

## 🔄 进行中
- [ ]

## ✅ 已完成
- [ ]

## 📋 待办
- [ ]
`;

// CONTEXT.md 模板
const CONTEXT_TEMPLATE = `# [AGENT] 共享上下文

> 所有渠道共享的重要上下文信息
> **统一路径：workspace/memory/CONTEXT.md**

---

## 最新状态
_最后更新时间：_

## 重要上下文
- 
`;

// PROTOCOL.md 模板
const PROTOCOL_DOC = `# 共享记忆协议

## 🚨 最高优先级规则

### 每次对话开始时
1. **读取** \`workspace/memory/TASKS.md\`
2. **读取** \`workspace/memory/CONTEXT.md\`

### 收到任务时
- **立即写入** \`TASKS.md\`
- 格式：\`- [ ] [任务] @[来源] @[时间]\`

### 回答问题前
- **必须引用** \`TASKS.md\` 内容
- 在回答开头说明当前任务状态

### 完成任务时
- **立即更新** \`TASKS.md\`，标记为 ✅ 已完成

---

**这是强制协议，不遵守就等于失职！**
`;

function setupAgent(agentName) {
    console.log(\`\n🔧 部署 \${agentName}...\`);
    
    const workspaceDir = path.join(__dirname, '..', '..', '..', 'agents', agentName, 'workspace');
    const memoryDir = path.join(workspaceDir, 'memory');
    
    // 1. 创建 memory 目录
    if (!fs.existsSync(memoryDir)) {
        fs.mkdirSync(memoryDir, { recursive: true });
        console.log(\`  ✅ 创建 memory 目录\`);
    }
    
    // 2. 创建 TASKS.md
    const tasksPath = path.join(memoryDir, 'TASKS.md');
    if (!fs.existsSync(tasksPath)) {
        const tasksContent = TASKS_TEMPLATE.replace('[AGENT]', agentName.charAt(0).toUpperCase() + agentName.slice(1));
        fs.writeFileSync(tasksPath, tasksContent, 'utf8');
        console.log(\`  ✅ 创建 TASKS.md\`);
    } else {
        console.log(\`  ⏭️  TASKS.md 已存在，跳过\`);
    }
    
    // 3. 创建 CONTEXT.md
    const contextPath = path.join(memoryDir, 'CONTEXT.md');
    if (!fs.existsSync(contextPath)) {
        const contextContent = CONTEXT_TEMPLATE.replace('[AGENT]', agentName.charAt(0).toUpperCase() + agentName.slice(1));
        fs.writeFileSync(contextPath, contextContent, 'utf8');
        console.log(\`  ✅ 创建 CONTEXT.md\`);
    } else {
        console.log(\`  ⏭️  CONTEXT.md 已存在，跳过\`);
    }
    
    // 4. 创建 PROTOCOL.md
    const protocolPath = path.join(workspaceDir, 'PROTOCOL.md');
    if (!fs.existsSync(protocolPath)) {
        fs.writeFileSync(protocolPath, PROTOCOL_DOC, 'utf8');
        console.log(\`  ✅ 创建 PROTOCOL.md\`);
    } else {
        console.log(\`  ⏭️  PROTOCOL.md 已存在，跳过\`);
    }
    
    // 5. 更新 SOUL.md
    const soulPath = path.join(workspaceDir, 'SOUL.md');
    if (fs.existsSync(soulPath)) {
        let soulContent = fs.readFileSync(soulPath, 'utf8');
        if (!soulContent.includes('SHARED MEMORY PROTOCOL')) {
            fs.appendFileSync(soulPath, PROTOCOL_SECTION, 'utf8');
            console.log(\`  ✅ 更新 SOUL.md\`);
        } else {
            console.log(\`  ⏭️  SOUL.md 已包含协议，跳过\`);
        }
    } else {
        console.log(\`  ⚠️  SOUL.md 不存在，跳过\`);
    }
    
    console.log(\`  ✅ \${agentName} 部署完成！\`);
}

// 主函数
function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--all')) {
        console.log('🚀 开始批量部署所有 Agent...\');
        AGENTS.forEach(agent => setupAgent(agent));
        console.log('\n✅ 所有 Agent 部署完成！');
    } else if (args.includes('--agent')) {
        const agentIndex = args.indexOf('--agent');
        const agentName = args[agentIndex + 1];
        if (agentName) {
            setupAgent(agentName);
        } else {
            console.error('❌ 请指定 Agent 名称：--agent=yoyo');
        }
    } else {
        console.log(\`
🔧 Agent Shared Memory System - 部署脚本

用法：
  npx ts-node setup.js --all                    # 部署所有 Agent
  npx ts-node setup.js --agent=yoyo            # 部署单个 Agent

示例：
  npx ts-node setup.js --all                   # 部署所有 8 个 Agent
  npx ts-node setup.js --agent=bobby           # 只部署 Bobby
\`);
    }
}

main();
