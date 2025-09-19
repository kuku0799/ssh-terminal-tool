const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🐳 Docker SSH Terminal Tool 设置');
console.log('================================');

// 检查Docker是否安装
try {
  execSync('docker --version', { stdio: 'pipe' });
  console.log('✅ Docker已安装');
} catch (error) {
  console.error('❌ Docker未安装，请先安装Docker');
  console.log('安装指南: https://docs.docker.com/get-docker/');
  process.exit(1);
}

// 检查Docker Compose是否安装
try {
  execSync('docker-compose --version', { stdio: 'pipe' });
  console.log('✅ Docker Compose已安装');
} catch (error) {
  console.error('❌ Docker Compose未安装，请先安装Docker Compose');
  console.log('安装指南: https://docs.docker.com/compose/install/');
  process.exit(1);
}

// 创建必要的目录
const dirs = ['data', 'logs', 'config', 'mount'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ 创建目录: ${dir}`);
  } else {
    console.log(`✅ 目录已存在: ${dir}`);
  }
});

// 创建默认配置文件
const configPath = path.join(__dirname, '..', 'config', 'default.json');
if (!fs.existsSync(configPath)) {
  const defaultConfig = {
    "server": {
      "port": 3000,
      "host": "0.0.0.0"
    },
    "ssh": {
      "defaultPort": 22,
      "timeout": 30000
    },
    "rdp": {
      "defaultPort": 3389,
      "timeout": 30000
    },
    "monitoring": {
      "interval": 5000,
      "enabled": true
    }
  };
  
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  console.log('✅ 创建默认配置文件');
}

// 创建SSH密钥目录（如果不存在）
const sshDir = path.join(process.env.HOME || process.env.USERPROFILE, '.ssh');
if (!fs.existsSync(sshDir)) {
  fs.mkdirSync(sshDir, { recursive: true });
  console.log('✅ 创建SSH密钥目录');
}

console.log('\n🚀 开始构建Docker镜像...');
try {
  execSync('docker build -t ssh-terminal-tool .', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('✅ Docker镜像构建成功');
} catch (error) {
  console.error('❌ Docker镜像构建失败:', error.message);
  process.exit(1);
}

console.log('\n📋 可用的Docker命令:');
console.log('  npm run docker:up     - 启动容器');
console.log('  npm run docker:down   - 停止容器');
console.log('  npm run docker:logs   - 查看日志');
console.log('  npm run docker:shell  - 进入容器shell');
console.log('  npm run docker:run    - 直接运行容器');

console.log('\n🌐 访问地址:');
console.log('  Web界面: http://localhost:3000');
console.log('  API接口: http://localhost:8080');
console.log('  VNC连接: localhost:5900 (如果启用)');

console.log('\n✅ Docker设置完成！');
console.log('运行 "npm run docker:up" 启动应用');
