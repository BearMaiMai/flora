const { execSync } = require('child_process')

/** 获取当前暂存文件列表 */
const getStagedFiles = () => {
  const output = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
  return output.split('\n').filter(f => f.trim())
}

/** 判断是否为 API 相关代码文件 */
const isApiCodeFile = (file) => {
  return (
    /^miniprogram\/services\/.*\.js$/.test(file) ||
    /^cloudfunctions\/.*\/actions\/.*\.js$/.test(file)
  )
}

/** 判断是否为 API 文档文件 */
const isApiDocFile = (file) => {
  return /^docs\/API.*\.md$/.test(file)
}

/** 主逻辑 */
const main = () => {
  const stagedFiles = getStagedFiles()

  if (stagedFiles.length === 0) {
    process.exit(0)
  }

  const apiCodeFiles = stagedFiles.filter(isApiCodeFile)
  const apiDocFiles = stagedFiles.filter(isApiDocFile)

  // 没有修改 API 代码 → 直接通过
  if (apiCodeFiles.length === 0) {
    console.log('✅ 未修改 API 代码，跳过文档检查。')
    process.exit(0)
  }

  console.log('⚠️  检测到 API 代码修改：')
  apiCodeFiles.forEach(f => console.log(`   - ${f}`))

  // 修改了 API 代码，但没有修改文档 → 阻止提交
  if (apiDocFiles.length === 0) {
    console.error('')
    console.error('❌ 提交被阻止：修改了 API 代码，但未更新对应文档！')
    console.error('')
    console.error('请同时更新以下文档（任一个即可）：')
    console.error('  - docs/API接口文档.md')
    console.error('  - docs/API索引.md')
    console.error('  - docs/API接口与复用清单.md')
    console.error('')
    console.error('操作步骤：')
    console.error('  1. 更新上述文档')
    console.error('  2. git add docs/API接口文档.md docs/API索引.md')
    console.error('  3. 重新 git commit')
    console.error('')
    console.error('如果确实不需要更新文档，强制提交：git commit --no-verify')
    process.exit(1)
  }

  // 代码和文档都修改了 → 通过
  console.log('✅ API 文档已同步更新：')
  apiDocFiles.forEach(f => console.log(`   - ${f}`))
  console.log('✅ 提交通过。')
  process.exit(0)
}

main()
