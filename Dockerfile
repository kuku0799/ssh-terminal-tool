# 使用Node.js 18 Alpine作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装必要的系统依赖
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    libc6-compat \
    xvfb \
    x11vnc \
    fluxbox \
    xterm

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S sshuser -u 1001

# 创建必要的目录并设置权限
RUN mkdir -p /app/data /app/logs /app/config
RUN chown -R sshuser:nodejs /app

# 切换到非root用户
USER sshuser

# 暴露端口
EXPOSE 3000 8080 5900

# 设置环境变量
ENV NODE_ENV=production
ENV DISPLAY=:99

# 创建启动脚本
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 启动命令
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
