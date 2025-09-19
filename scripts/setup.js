const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 SSH Terminal Tool 项目设置');
console.log('================================');

// 检查Node.js版本
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ 需要Node.js 18或更高版本');
  console.error(`当前版本: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js版本检查通过: ${nodeVersion}`);

// 检查是否已安装依赖
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 安装依赖包...');
  try {
    // 先尝试安装核心依赖
    console.log('安装核心依赖...');
    execSync('npm install react react-dom react-router-dom', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    
    console.log('安装UI依赖...');
    execSync('npm install styled-components lucide-react zustand react-hot-toast', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    
    console.log('安装终端依赖...');
    execSync('npm install xterm xterm-addon-fit xterm-addon-web-links xterm-addon-search xterm-addon-unicode11', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    
    console.log('安装编辑器依赖...');
    execSync('npm install monaco-editor', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    
    console.log('安装开发依赖...');
    execSync('npm install electron electron-builder concurrently', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    
    console.log('✅ 依赖安装完成');
  } catch (error) {
    console.error('❌ 依赖安装失败:', error.message);
    console.log('💡 请尝试手动安装: npm install');
    process.exit(1);
  }
} else {
  console.log('✅ 依赖已安装');
}

// 创建必要的目录
const dirs = ['dist', 'release', 'assets'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 创建目录: ${dir}`);
  }
});

console.log('');
console.log('🎉 项目设置完成！');
console.log('');
console.log('可用命令:');
console.log('  npm run dev        - 启动开发模式');
console.log('  npm run build      - 构建应用');
console.log('  npm run dist:win   - 构建Windows版本');
console.log('  npm run dist:mac   - 构建macOS版本');
console.log('  npm run dist:linux - 构建Linux版本');
console.log('');
console.log('开始开发: npm run dev');
