/**
 * API 文档自动生成脚本
 * 从 service 文件的 JSDoc 注释提取信息，生成规范的接口文档
 */
const fs = require('fs')
const path = require('path')

const SERVICES_DIR = path.join(__dirname, '..', 'miniprogram', 'services')
const CLOUDFUNCTIONS_DIR = path.join(__dirname, '..', 'cloudfunctions')
const DOCS_DIR = path.join(__dirname, '..', 'docs')
const ERROR_CODES_FILE = path.join(CLOUDFUNCTIONS_DIR, 'utils', 'error-codes.js')

// ==================== 解析工具函数 ====================

/** 读取错误码定义 */
function loadErrorCodes() {
  const content = fs.readFileSync(ERROR_CODES_FILE, 'utf8')
  const codes = {}
  const regex = /(\w+):\s*\{\s*code:\s*(-?\d+),\s*message:\s*['"]([^'"]+)['"]/g
  let match
  while ((match = regex.exec(content)) !== null) {
    codes[match[1]] = {
      code: parseInt(match[2]),
      message: match[3]
    }
  }
  return codes
}

/** 从 service 文件中提取所有带 JSDoc 的方法 */
function extractMethods(content) {
  const methods = []
  const jsdocRegex = /\/\*\*([\s\S]*?)\*\//g
  let match

  while ((match = jsdocRegex.exec(content)) !== null) {
    const jsdocText = match[1]
    const endIndex = match.index + match[0].length
    const afterText = content.slice(endIndex)

    // 跳过空白和单行注释，找方法定义
    const cleanAfter = afterText.replace(/^\s*\/\/.*$/gm, '').trim()
    const methodMatch = cleanAfter.match(/^(\w+)\s*\(([^)]*)\)\s*\{/)

    if (methodMatch) {
      methods.push({
        jsdoc: jsdocText,
        name: methodMatch[1],
        params: methodMatch[2].trim()
      })
    }
  }

  return methods
}

/** 解析 JSDoc 文本 */
function parseJSDoc(jsdocText) {
  const result = {
    description: '',
    params: [],
    returns: [],
    example: ''
  }

  const lines = jsdocText.split('\n')
    .map(l => l.replace(/^\s*\*\s?/, '').trim())
    .filter(l => l && l !== '*')

  let inExample = false

  for (const line of lines) {
    if (line.startsWith('@param')) {
      inExample = false
      // 手动解析参数声明，避免正则无法处理 [name=[]] 等复杂默认值
      const paramDeclMatch = line.match(/@param\s+\{([^}]+)\}\s+(.*)/)
      if (paramDeclMatch) {
        const type = paramDeclMatch[1]
        let rest = paramDeclMatch[2].trim()

        let optional = false
        let name = ''
        let defaultVal = ''
        let description = ''

        if (rest.startsWith('[')) {
          optional = true
          // 找到匹配的 ]（处理默认值中包含 [] 的情况）
          let bracketCount = 0
          let closeIdx = -1
          for (let i = 0; i < rest.length; i++) {
            if (rest[i] === '[') bracketCount++
            else if (rest[i] === ']') {
              bracketCount--
              if (bracketCount === 0) {
                closeIdx = i
                break
              }
            }
          }
          if (closeIdx > 0) {
            const inner = rest.slice(1, closeIdx)
            const eqIdx = inner.indexOf('=')
            if (eqIdx > 0) {
              name = inner.slice(0, eqIdx)
              defaultVal = inner.slice(eqIdx + 1)
            } else {
              name = inner
            }
            description = rest.slice(closeIdx + 1).replace(/^\s*-?\s*/, '')
          }
        } else {
          const dashIdx = rest.indexOf(' - ')
          if (dashIdx > 0) {
            name = rest.slice(0, dashIdx).trim()
            description = rest.slice(dashIdx + 3)
          } else {
            name = rest
          }
        }

        result.params.push({
          type,
          optional,
          name,
          default: defaultVal,
          description
        })
      }
    } else if (line.startsWith('@returns') || line.startsWith('@return')) {
      inExample = false
      // @returns {Type} path - description
      const returnMatch = line.match(/@returns?\s+\{([^}]+)\}\s+([\w.[\]]+)\s*-?\s*(.*)/)
      if (returnMatch) {
        result.returns.push({
          type: returnMatch[1],
          path: returnMatch[2].replace(/^returns\./, ''),
          description: returnMatch[3]
        })
      }
    } else if (line.startsWith('@example')) {
      inExample = true
    } else if (inExample) {
      result.example += line + '\n'
    } else if (!line.startsWith('@') && !result.description) {
      result.description = line
    }
  }

  result.example = result.example.trim()
  return result
}

/** 从方法体中提取 callFunction 调用信息 */
function extractCallFunction(content, methodName) {
  const methodRegex = new RegExp(`${methodName}\\s*\\([^)]*\\)\\s*\\{`)
  const match = content.match(methodRegex)
  if (!match) return null

  // 从匹配到的 '{' 开始计算大括号（避免 params={} 干扰）
  const startBraceIndex = match.index + match[0].length - 1
  let braceCount = 0
  let endIndex = startBraceIndex

  for (let i = startBraceIndex; i < content.length; i++) {
    if (content[i] === '{') {
      braceCount++
    } else if (content[i] === '}') {
      braceCount--
      if (braceCount === 0) {
        endIndex = i
        break
      }
    }
  }

  const methodBody = content.slice(startBraceIndex, endIndex + 1)
  const callMatch = methodBody.match(/callFunction\s*\(\s*['"]([^'"]+)['"]\s*,\s*\{\s*action:\s*['"]([^'"]+)['"]/)

  if (callMatch) {
    return {
      cloudFunction: callMatch[1],
      action: callMatch[2]
    }
  }
  return null
}

/** 从 action 文件中提取错误码 */
function extractActionErrors(cloudFunction, action, errorCodesMap) {
  const actionPath = path.join(CLOUDFUNCTIONS_DIR, cloudFunction, 'actions', `${action}.js`)
  if (!fs.existsSync(actionPath)) return []

  const content = fs.readFileSync(actionPath, 'utf8')
  const errors = []

  // 匹配 errorCodes.XXX
  const errorMatches = content.match(/errorCodes\.(\w+)/g)
  if (errorMatches) {
    const unique = [...new Set(errorMatches)]
    unique.forEach(m => {
      const key = m.replace('errorCodes.', '')
      if (errorCodesMap[key] && errorCodesMap[key].code !== 0) {
        errors.push(errorCodesMap[key])
      }
    })
  }

  return errors
}

// ==================== 文档生成函数 ====================

/** 生成 Markdown 文档 */
function generateMarkdown(docs, errorCodesMap) {
  let md = '# 养花呀 - API 接口文档\n\n'
  md += '> **本文档由脚本自动生成，请勿手动修改**\n>\n'
  md += `> **生成时间**：${new Date().toLocaleString('zh-CN')}\n>\n`
  md += `> **版本**：1.0.0\n>\n`
  md += `> **云环境 ID**：cloud1-d1gjubt747d28d4ac\n\n`
  md += '---\n\n'

  // 目录
  md += '## 目录\n\n'
  docs.forEach(service => {
    md += `- [${service.serviceName}](#${service.serviceName.toLowerCase()})\n`
    service.methods.forEach(method => {
      md += `  - [${method.name}](#${method.name.toLowerCase()})\n`
    })
  })
  md += '- [错误码总表](#错误码总表)\n'
  md += '\n---\n\n'

  // 接口详情
  docs.forEach(service => {
    md += `## ${service.serviceName}\n\n`
    md += `> 文件：\`${service.filePath}\`\n\n`

    service.methods.forEach(method => {
      md += `### ${method.name}\n\n`
      md += `**功能**：${method.description}\n\n`
      md += `**调用方式**：\`wx.cloud.callFunction({ name: '${method.cloudFunction}', data: { action: '${method.action}'${method.params.length > 0 ? ', ...params' : ''} } })\`\n\n`

      // 请求参数表格（过滤掉 Object 类型的父参数，只保留叶子节点）
      const leafParams = method.params.filter(p => p.name.includes('.'))
      const parentNames = new Set(leafParams.map(p => p.name.split('.')[0]))
      const displayParams = method.params.filter(p => {
        // 如果参数是 Object 类型且有子参数，则不显示
        if (p.type === 'Object' && parentNames.has(p.name)) return false
        return true
      })

      if (displayParams.length > 0) {
        md += '**请求参数**：\n\n'
        md += '| 参数名 | 类型 | 必填 | 默认值 | 取值范围 | 参数格式 | 示例值 | 说明 |\n'
        md += '|--------|------|------|--------|----------|----------|--------|------|\n'
        displayParams.forEach(p => {
          const required = p.optional ? '否' : '是'
          const defaultVal = p.default || '-'
          md += `| ${p.name} | ${p.type} | ${required} | ${defaultVal} | - | - | - | ${p.description || '-'} |\n`
        })
        md += '\n'
      } else {
        md += '**请求参数**：无\n\n'
      }

      // 返回 JSON 示例
      md += '**正确返回 JSON**：\n\n'
      md += '```json\n'
      if (method.returns.length > 0) {
        md += '{\n  "code": 0,\n  "data": { ... }\n}\n'
      } else {
        md += '{\n  "code": 0,\n  "message": "成功"\n}\n'
      }
      md += '```\n\n'

      // 响应参数表格
      if (method.returns.length > 0) {
        md += '**响应参数**：\n\n'
        md += '| 参数名 | 类型 | 参数格式 | 说明 |\n'
        md += '|--------|------|----------|------|\n'
        method.returns.forEach(r => {
          md += `| ${r.path} | ${r.type} | - | ${r.description} |\n`
        })
        md += '\n'
      }

      // 错误码表格
      if (method.errors.length > 0) {
        md += '**可能返回的错误码**：\n\n'
        md += '| 错误码 | 错误信息 | 含义 |\n'
        md += '|--------|----------|------|\n'
        method.errors.forEach(e => {
          md += `| ${e.code} | ${e.message} | |\n`
        })
        md += '\n'
      }

      // 调用示例
      if (method.example) {
        md += '**调用示例**：\n\n'
        md += '```javascript\n'
        md += method.example + '\n'
        md += '```\n\n'
      }

      md += '---\n\n'
    })
  })

  // 错误码总表
  md += '## 错误码总表\n\n'
  md += '| 错误码 | 错误信息 | 含义 |\n'
  md += '|--------|----------|------|\n'
  Object.values(errorCodesMap).forEach(ec => {
    if (ec.code !== 0) {
      md += `| ${ec.code} | ${ec.message} | |\n`
    }
  })

  return md
}

/** 生成 JSON 文档 */
function generateJSON(docs, errorCodesMap) {
  return JSON.stringify({
    version: '1.0.0',
    updateTime: new Date().toISOString(),
    cloudEnv: 'cloud1-d1gjubt747d28d4ac',
    services: docs.map(s => ({
      name: s.serviceName,
      file: s.filePath,
      methods: s.methods.map(m => ({
        name: m.name,
        description: m.description,
        cloudFunction: m.cloudFunction,
        action: m.action,
        params: m.params,
        returns: m.returns,
        errorCodes: m.errors.map(e => e.code),
        example: m.example
      }))
    })),
    errorCodes: Object.values(errorCodesMap)
  }, null, 2)
}

// ==================== 主函数 ====================

function main() {
  console.log('📝 正在生成 API 文档...\n')

  // 加载错误码
  const errorCodesMap = loadErrorCodes()
  console.log(`✅ 加载 ${Object.keys(errorCodesMap).length} 个错误码\n`)

  // 扫描 service 文件
  const serviceFiles = fs.readdirSync(SERVICES_DIR).filter(f => f.endsWith('.js'))
  const docs = []

  serviceFiles.forEach(file => {
    const filePath = path.join(SERVICES_DIR, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const methods = extractMethods(content)
    const serviceName = file.replace('.js', '') + 'Service'

    console.log(`📄 解析 ${file}，找到 ${methods.length} 个方法`)

    const parsedMethods = methods.map(m => {
      const jsdoc = parseJSDoc(m.jsdoc)
      const callInfo = extractCallFunction(content, m.name)

      let errors = []
      if (callInfo) {
        errors = extractActionErrors(callInfo.cloudFunction, callInfo.action, errorCodesMap)
      }

      return {
        name: m.name,
        description: jsdoc.description,
        params: jsdoc.params,
        returns: jsdoc.returns,
        example: jsdoc.example,
        cloudFunction: callInfo ? callInfo.cloudFunction : '',
        action: callInfo ? callInfo.action : '',
        errors
      }
    })

    docs.push({
      serviceName,
      filePath: `miniprogram/services/${file}`,
      methods: parsedMethods
    })
  })

  // 生成文档
  console.log('\n📝 生成 Markdown 文档...')
  const mdContent = generateMarkdown(docs, errorCodesMap)
  fs.writeFileSync(path.join(DOCS_DIR, 'API接口文档.md'), mdContent, 'utf8')

  console.log('📝 生成 JSON 文档...')
  const jsonContent = generateJSON(docs, errorCodesMap)
  fs.writeFileSync(path.join(DOCS_DIR, 'API接口文档.json'), jsonContent, 'utf8')

  console.log('\n✅ API 文档已生成：')
  console.log('   📄 docs/API接口文档.md')
  console.log('   📄 docs/API接口文档.json')
}

main()
