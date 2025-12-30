# Coreterra MVP

Coreterra 是一款融合了 RPG 游戏化机制的多人协作 GTD (Getting Things Done) 工具。

## 项目结构

```
coreterra-mvp/
├── frontend/          # React + TypeScript + Vite 前端应用
├── backend/           # FastAPI 后端应用
└── README.md
```

## 技术栈

### Frontend
- React 18 + TypeScript
- Vite
- React Router v6
- shadcn/ui (基于 Radix UI + Tailwind CSS)
- Tailwind CSS
- Axios

### Backend
- FastAPI
- Python 3.9+
- JWT 认证 (python-jose)
- JSON 文件存储 (MVP 阶段)

## 快速开始

### 一键启动（推荐）

使用根目录的 `run.sh` 脚本一键启动前后端：

```bash
./run.sh
```

脚本会自动：
- 检查并安装前端依赖（如果需要）
- 启动后端服务器（支持 uv 或虚拟环境）
- 启动前端开发服务器
- 显示实时日志
- 按 Ctrl+C 优雅关闭所有服务器

### 手动启动

#### 后端设置

1. 进入后端目录：
```bash
cd backend
```

2. 安装依赖（推荐使用 uv）：
```bash
# 使用 uv（推荐）
uv sync

# 或使用 pip
pip install -e .

# 或创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -e .
```

3. 启动后端服务器：
```bash
# 使用 uv
uv run uvicorn app.main:app --reload --port 8000

# 或使用虚拟环境
uvicorn app.main:app --reload --port 8000
```

后端 API 将在 `http://localhost:8000` 运行。

#### 前端设置

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

前端应用将在 `http://localhost:5173` 运行。

## 认证信息

MVP 阶段使用硬编码的测试用户：
- **用户名**: `alex`
- **密码**: `test`

## API 文档

启动后端后，访问以下地址查看 API 文档：
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 主要功能

### C.C.O.R.E 工作流
- **Capture (收集)**: 快速捕获想法到收件箱
- **Clarify (理清)**: 定义任务难度、时长，计算 XP 奖励
- **Organize (组织)**: 将任务分配到项目、情境或团队成员
- **Review (回顾)**: 查看已完成任务和统计数据
- **Engage (执行)**: 执行模式，完成任务获得奖励

### 游戏化功能
- XP 和金币系统
- 等级提升
- 连胜记录
- 成就系统
- 商店（使用金币购买道具）

## 数据存储

MVP 阶段使用 JSON 文件存储数据（`backend/data/mock_data.json`）。所有更改会在内存中生效，重启服务器后会从 JSON 文件重新加载初始数据。

## 开发说明

### 添加新的 API 路由

1. 在 `backend/app/routers/` 创建新的路由文件
2. 在 `backend/app/main.py` 中注册路由

### 添加新的前端页面

1. 在 `frontend/src/pages/` 创建页面组件
2. 在 `frontend/src/App.tsx` 中添加路由

### 使用 shadcn/ui 组件

项目已配置 shadcn/ui，可以直接使用已安装的组件：
- Button
- Card
- Input
- Dialog
- Select
- Checkbox
- Tabs
- 等等

## 注意事项

1. **数据持久化**: MVP 阶段数据存储在 JSON 文件中，重启后会恢复初始状态
2. **认证**: 使用简单的 JWT，硬编码测试用户
3. **CORS**: 已配置允许前端开发服务器访问
4. **错误处理**: 实现了基本的错误处理和用户反馈

## 下一步

- [ ] 实现数据库持久化（SQLite 或 PostgreSQL）
- [ ] 完善用户认证系统
- [ ] 实现拖拽功能（任务分配）
- [ ] 添加实时通知
- [ ] 完善日历视图
- [ ] 实现团队协作功能

## 许可证

MIT

