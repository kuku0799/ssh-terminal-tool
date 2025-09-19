#!/bin/bash

# Docker恢复脚本
BACKUP_DIR="backups"

echo "🔄 SSH Terminal Tool Docker恢复"
echo "==============================="

# 检查备份目录
if [ ! -d "${BACKUP_DIR}" ]; then
    echo "❌ 备份目录不存在: ${BACKUP_DIR}"
    exit 1
fi

# 列出可用备份
echo "📋 可用备份:"
ls -la ${BACKUP_DIR}/ssh-tool-backup-*.tar.gz 2>/dev/null || {
    echo "❌ 没有找到备份文件"
    exit 1
}

echo ""

# 选择备份文件
if [ -z "$1" ]; then
    echo "请选择要恢复的备份文件:"
    select backup in ${BACKUP_DIR}/ssh-tool-backup-*.tar.gz; do
        if [ -n "$backup" ]; then
            BACKUP_FILE="$backup"
            break
        else
            echo "无效选择，请重试"
        fi
    done
else
    BACKUP_FILE="$1"
fi

# 检查备份文件
if [ ! -f "${BACKUP_FILE}" ]; then
    echo "❌ 备份文件不存在: ${BACKUP_FILE}"
    exit 1
fi

echo "📦 恢复备份: ${BACKUP_FILE}"

# 停止容器
echo "⏹️ 停止容器..."
docker-compose down

# 备份当前数据
echo "💾 备份当前数据..."
CURRENT_BACKUP="current-backup-$(date +%Y%m%d_%H%M%S).tar.gz"
tar -czf ${BACKUP_DIR}/${CURRENT_BACKUP} data/ config/ logs/ 2>/dev/null || true

# 清理当前数据
echo "🧹 清理当前数据..."
rm -rf data/ config/ logs/

# 恢复备份
echo "🔄 恢复数据..."
tar -xzf "${BACKUP_FILE}"

# 设置权限
echo "🔐 设置权限..."
chmod -R 755 data/ config/ logs/
chmod -R 700 data/connections data/config

# 启动容器
echo "🚀 启动容器..."
docker-compose up -d

# 检查恢复结果
if docker-compose ps | grep -q "Up"; then
    echo "✅ 恢复完成！"
    echo "🌐 访问地址: http://localhost:3000"
else
    echo "❌ 恢复失败，容器启动异常"
    echo "查看日志: npm run docker:logs"
    exit 1
fi
