#!/bin/bash

# Docker监控脚本
echo "📊 SSH Terminal Tool Docker监控"
echo "================================"

# 检查容器状态
echo "🔍 容器状态:"
docker-compose ps

echo ""

# 检查资源使用
echo "💻 资源使用:"
docker stats --no-stream ssh-terminal-tool 2>/dev/null || echo "容器未运行"

echo ""

# 检查日志
echo "📝 最近日志:"
docker-compose logs --tail=20 ssh-tool

echo ""

# 检查端口
echo "🌐 端口状态:"
netstat -tulpn | grep -E ":(3000|8080|5900)" || echo "端口未监听"

echo ""

# 检查数据目录
echo "📁 数据目录:"
ls -la data/ 2>/dev/null || echo "数据目录不存在"

echo ""

# 检查配置
echo "⚙️ 配置文件:"
ls -la config/ 2>/dev/null || echo "配置目录不存在"

echo ""

# 检查挂载
echo "🔗 挂载状态:"
docker inspect ssh-terminal-tool | grep -A 10 "Mounts" 2>/dev/null || echo "无法获取挂载信息"
