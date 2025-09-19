#!/bin/bash

# Docker健康检查脚本
echo "🏥 SSH Terminal Tool Docker健康检查"
echo "=================================="

# 检查容器状态
echo "🔍 容器状态检查..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ 容器运行正常"
else
    echo "❌ 容器未运行"
    exit 1
fi

# 检查端口
echo "🌐 端口检查..."
for port in 3000 8080; do
    if netstat -tulpn | grep -q ":$port "; then
        echo "✅ 端口 $port 正常"
    else
        echo "❌ 端口 $port 未监听"
    fi
done

# 检查Web服务
echo "🌍 Web服务检查..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Web服务正常"
else
    echo "❌ Web服务异常"
fi

# 检查API服务
echo "🔌 API服务检查..."
if curl -s http://localhost:8080/health > /dev/null; then
    echo "✅ API服务正常"
else
    echo "❌ API服务异常"
fi

# 检查数据目录
echo "📁 数据目录检查..."
if [ -d "data" ] && [ -w "data" ]; then
    echo "✅ 数据目录正常"
else
    echo "❌ 数据目录异常"
fi

# 检查日志
echo "📝 日志检查..."
if [ -d "logs" ] && [ -w "logs" ]; then
    echo "✅ 日志目录正常"
else
    echo "❌ 日志目录异常"
fi

# 检查配置
echo "⚙️ 配置检查..."
if [ -d "config" ] && [ -r "config" ]; then
    echo "✅ 配置目录正常"
else
    echo "❌ 配置目录异常"
fi

# 检查资源使用
echo "💻 资源使用检查..."
RESOURCE_USAGE=$(docker stats --no-stream --format "table {{.CPUPerc}}\t{{.MemUsage}}" ssh-terminal-tool 2>/dev/null | tail -n +2)
if [ -n "$RESOURCE_USAGE" ]; then
    echo "✅ 资源使用正常: $RESOURCE_USAGE"
else
    echo "❌ 无法获取资源使用信息"
fi

echo ""
echo "🏥 健康检查完成"
