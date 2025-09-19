@echo off
echo 🚀 SSH Terminal Tool 一键安装
echo ============================

REM 检查Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 请先安装Docker Desktop
    echo 下载地址: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo ✅ Docker已安装

REM 检查Docker是否运行
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker未运行，请先启动Docker Desktop
    pause
    exit /b 1
)

echo ✅ Docker正在运行

REM 克隆项目
echo 📥 下载项目...
git clone https://github.com/kuku0799/ssh-terminal-tool.git
cd ssh-terminal-tool

REM 创建必要目录
echo 📁 创建必要目录...
if not exist data mkdir data
if not exist logs mkdir logs
if not exist config mkdir config
if not exist mount mkdir mount

REM 构建Docker镜像
echo 🔨 构建Docker镜像...
docker build -t ssh-terminal-tool .

if %errorlevel% neq 0 (
    echo ❌ 镜像构建失败
    pause
    exit /b 1
)

REM 启动容器
echo 🚀 启动容器...
docker-compose up -d

REM 等待启动
echo ⏳ 等待容器启动...
timeout /t 10 /nobreak >nul

REM 检查状态
docker-compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ 安装完成！
    echo.
    echo 🌐 访问地址:
    echo   Web界面: http://localhost:3000
    echo   API接口: http://localhost:8080
    echo   VNC连接: localhost:5900 (如果启用)
    echo.
    echo 📋 常用命令:
    echo   查看日志: docker-compose logs -f
    echo   进入容器: docker-compose exec ssh-tool sh
    echo   停止容器: docker-compose down
    echo.
    echo 🎉 享受使用SSH Terminal Tool！
) else (
    echo ❌ 启动失败
    echo 查看日志: docker-compose logs
)

pause
