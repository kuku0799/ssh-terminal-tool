const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 修复依赖问题...');

try {
  // 1. 清理缓存
  console.log('1. 清理npm缓存...');
  execSync('npm cache clean --force', { stdio: 'inherit' });

  // 2. 删除node_modules和package-lock.json
  console.log('2. 删除旧的依赖文件...');
  if (fs.existsSync('node_modules')) {
    fs.rmSync('node_modules', { recursive: true, force: true });
  }
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
  }

  // 3. 使用简化的package.json
  console.log('3. 使用简化的依赖配置...');
  if (fs.existsSync('package-simple.json')) {
    fs.copyFileSync('package-simple.json', 'package.json');
  }

  // 4. 设置npm镜像（可选）
  console.log('4. 设置npm镜像...');
  try {
    execSync('npm config set registry https://registry.npmmirror.com', { stdio: 'inherit' });
  } catch (error) {
    console.log('镜像设置失败，继续使用默认源...');
  }

  // 5. 安装依赖
  console.log('5. 安装依赖...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('✅ 依赖修复完成！');
  console.log('现在可以运行: npm run dev');

} catch (error) {
  console.error('❌ 修复失败:', error.message);
  console.log('请尝试手动执行以下命令:');
  console.log('1. npm cache clean --force');
  console.log('2. rm -rf node_modules package-lock.json');
  console.log('3. npm install');
}
