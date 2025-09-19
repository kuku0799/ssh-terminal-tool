#!/bin/bash

# Docker备份脚本
BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="ssh-tool-backup-${TIMESTAMP}"

echo "💾 SSH Terminal Tool Docker备份"
echo "==============================="

# 创建备份目录
mkdir -p ${BACKUP_DIR}

# 停止容器
echo "⏹️ 停止容器..."
docker-compose down

# 备份数据
echo "📦 备份数据..."
tar -czf ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz \
    data/ \
    config/ \
    logs/ \
    docker-compose.yml \
    Dockerfile \
    .dockerignore

# 启动容器
echo "🚀 启动容器..."
docker-compose up -d

# 检查备份
if [ -f "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" ]; then
    BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" | cut -f1)
    echo "✅ 备份完成: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz (${BACKUP_SIZE})"
else
    echo "❌ 备份失败"
    exit 1
fi

# 清理旧备份（保留最近10个）
echo "🧹 清理旧备份..."
cd ${BACKUP_DIR}
ls -t ssh-tool-backup-*.tar.gz | tail -n +11 | xargs -r rm
cd ..

echo "✅ 备份完成！"
