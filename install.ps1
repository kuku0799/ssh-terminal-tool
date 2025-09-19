# SSH Terminal Tool PowerShell 安装脚本
Write-Host "🚀 SSH Terminal Tool 一键安装" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

# 检查Docker
Write-Host "🔍 检查Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker未安装"
    }
    Write-Host "✅ Docker已安装: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 请先安装Docker Desktop" -ForegroundColor Red
    Write-Host "下载地址: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    Read-Host "按任意键退出"
    exit 1
}

# 检查Docker是否运行
Write-Host "🔍 检查Docker状态..." -ForegroundColor Yellow
try {
    docker info 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker未运行"
    }
    Write-Host "✅ Docker正在运行" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker未运行，请先启动Docker Desktop" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

# 克隆项目
Write-Host "📥 下载项目..." -ForegroundColor Yellow
if (Test-Path "ssh-terminal-tool") {
    Write-Host "📁 项目目录已存在，更新项目..." -ForegroundColor Yellow
    Set-Location "ssh-terminal-tool"
    git pull origin main
} else {
    git clone https://github.com/kuku0799/ssh-terminal-tool.git
    Set-Location "ssh-terminal-tool"
}

# 创建必要目录
Write-Host "📁 创建必要目录..." -ForegroundColor Yellow
$dirs = @("data", "logs", "config", "mount")
foreach ($dir in $dirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# 构建Docker镜像
Write-Host "🔨 构建Docker镜像..." -ForegroundColor Yellow
docker build -t ssh-terminal-tool .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 镜像构建失败" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

# 启动容器
Write-Host "🚀 启动容器..." -ForegroundColor Yellow
docker-compose up -d

# 等待启动
Write-Host "⏳ 等待容器启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 检查状态
$containerStatus = docker-compose ps 2>$null | Select-String "Up"
if ($containerStatus) {
    Write-Host "✅ 安装完成！" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 访问地址:" -ForegroundColor Cyan
    Write-Host "  Web界面: http://localhost:3000" -ForegroundColor White
    Write-Host "  API接口: http://localhost:8080" -ForegroundColor White
    Write-Host "  VNC连接: localhost:5900 (如果启用)" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 常用命令:" -ForegroundColor Cyan
    Write-Host "  查看日志: docker-compose logs -f" -ForegroundColor White
    Write-Host "  进入容器: docker-compose exec ssh-tool sh" -ForegroundColor White
    Write-Host "  停止容器: docker-compose down" -ForegroundColor White
    Write-Host ""
    Write-Host "🎉 享受使用SSH Terminal Tool！" -ForegroundColor Green
} else {
    Write-Host "❌ 启动失败" -ForegroundColor Red
    Write-Host "查看日志: docker-compose logs" -ForegroundColor Yellow
}

Read-Host "按任意键退出"
