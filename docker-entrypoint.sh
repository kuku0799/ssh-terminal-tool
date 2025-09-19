#!/bin/sh

# 启动Xvfb虚拟显示器
echo "启动虚拟显示器..."
Xvfb :99 -screen 0 1024x768x24 -ac +extension GLX +render -noreset &
XVFB_PID=$!

# 等待Xvfb启动
sleep 2

# 启动fluxbox窗口管理器
echo "启动窗口管理器..."
fluxbox &
FLUXBOX_PID=$!

# 启动VNC服务器（可选）
if [ "$ENABLE_VNC" = "true" ]; then
    echo "启动VNC服务器..."
    x11vnc -display :99 -nopw -listen localhost -xkb &
    VNC_PID=$!
fi

# 设置环境变量
export DISPLAY=:99

# 创建数据目录
mkdir -p /app/data/connections
mkdir -p /app/data/logs
mkdir -p /app/data/config

# 启动应用
echo "启动SSH工具..."
exec "$@"

# 清理函数
cleanup() {
    echo "正在关闭应用..."
    if [ ! -z "$VNC_PID" ]; then
        kill $VNC_PID 2>/dev/null
    fi
    if [ ! -z "$FLUXBOX_PID" ]; then
        kill $FLUXBOX_PID 2>/dev/null
    fi
    if [ ! -z "$XVFB_PID" ]; then
        kill $XVFB_PID 2>/dev/null
    fi
    exit 0
}

# 捕获信号
trap cleanup SIGTERM SIGINT

# 等待进程
wait
