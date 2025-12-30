#!/bin/bash

# Coreterra MVP - 一键启动脚本
# 同时启动前端和后端服务器

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 清理函数
cleanup() {
    echo -e "\n${YELLOW}正在关闭服务器...${NC}"
    # 停止日志 tail
    if [ ! -z "$TAIL_PID" ]; then
        kill $TAIL_PID 2>/dev/null || true
    fi
    # 停止后端
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    # 停止前端
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    # 清理所有相关进程
    pkill -f "uvicorn app.main:app" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    echo -e "${GREEN}服务器已关闭${NC}"
    exit 0
}

# 捕获退出信号
trap cleanup SIGINT SIGTERM

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Coreterra MVP 启动脚本${NC}"
echo -e "${BLUE}========================================${NC}\n"

# 检查依赖
echo -e "${YELLOW}检查依赖...${NC}"

# 检查后端依赖（检查是否有安装的包）
if ! python3 -c "import fastapi" 2>/dev/null && ! command -v uv &> /dev/null; then
    echo -e "${YELLOW}后端依赖未安装，请先安装依赖：${NC}"
    echo -e "  使用 uv: cd backend && uv sync"
    echo -e "  或使用 pip: cd backend && pip install -e ."
    echo -e "  或创建虚拟环境后安装: cd backend && python -m venv venv && source venv/bin/activate && pip install -e ."
    exit 1
fi

# 检查前端依赖
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}前端依赖未安装，正在安装...${NC}"
    cd frontend
    npm install
    cd ..
fi

# 启动后端服务器
echo -e "\n${GREEN}启动后端服务器 (FastAPI)...${NC}"
cd backend

# 检测并使用 uv 或虚拟环境
if command -v uv &> /dev/null; then
    echo -e "${BLUE}使用 uv 运行后端...${NC}"
    uv run uvicorn app.main:app --reload --port 8000 > ../backend.log 2>&1 &
    BACKEND_PID=$!
elif [ -d "venv" ]; then
    source venv/bin/activate
    uvicorn app.main:app --reload --port 8000 > ../backend.log 2>&1 &
    BACKEND_PID=$!
elif [ -d ".venv" ]; then
    source .venv/bin/activate
    uvicorn app.main:app --reload --port 8000 > ../backend.log 2>&1 &
    BACKEND_PID=$!
else
    # 尝试直接运行（假设依赖已全局安装）
    uvicorn app.main:app --reload --port 8000 > ../backend.log 2>&1 &
    BACKEND_PID=$!
fi
cd ..

echo -e "${GREEN}后端服务器已启动 (PID: $BACKEND_PID)${NC}"
echo -e "  后端 API: ${BLUE}http://localhost:8000${NC}"
echo -e "  API 文档: ${BLUE}http://localhost:8000/docs${NC}"

# 等待后端启动
sleep 2

# 检查后端是否成功启动
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}后端启动失败！请检查 backend.log${NC}"
    exit 1
fi

# 启动前端服务器
echo -e "\n${GREEN}启动前端服务器 (Vite)...${NC}"
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}前端服务器已启动 (PID: $FRONTEND_PID)${NC}"
echo -e "  前端应用: ${BLUE}http://localhost:5173${NC}"

# 等待前端启动
sleep 3

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}   ✓ 所有服务器已启动${NC}"
echo -e "${GREEN}========================================${NC}\n"
echo -e "前端: ${BLUE}http://localhost:5173${NC}"
echo -e "后端: ${BLUE}http://localhost:8000${NC}"
echo -e "API 文档: ${BLUE}http://localhost:8000/docs${NC}\n"
echo -e "${YELLOW}按 Ctrl+C 停止所有服务器${NC}\n"

# 显示实时日志
echo -e "\n${BLUE}实时日志 (按 Ctrl+C 停止):${NC}\n"

# 使用 tail 显示日志，并保持脚本运行
tail -f backend.log frontend.log 2>/dev/null &
TAIL_PID=$!

# 等待用户中断（Ctrl+C 会触发 cleanup 函数）
wait

