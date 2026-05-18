/**
 * API 文档自动生成脚本 V3
 * 从后端云函数代码提取信息，生成专业 REST 风格的接口文档
 *
 * 扫描源：cloudfunctions/{function}/actions/{action}.js
 * 提取方式：
 *   - 文件顶部 JSDoc（描述、@example）
 *   - event 解构参数（const { ... } = event）
 *   - errorCodes 引用
 */
const fs = require('fs')
const path = require('path')

const CLOUDFUNCTIONS_DIR = path.join(__dirname, '..', 'cloudfunctions')
const DOCS_DIR = path.join(__dirname, '..', 'docs')
const ERROR_CODES_FILE = path.join(CLOUDFUNCTIONS_DIR, 'utils', 'error-codes.js')

// ==================== 文档版本与变更记录 ====================
const DOC_VERSION = '1.0.0'
const DOC_CHANGE_LOG = [
  { date: '2026-05-14', desc: '创建接口文档 V2，支持完整 REST 风格文档', operator: 'AI Assistant' },
  { date: '2026-05-18', desc: '脚本改为扫描后端云函数，前端代码零改动', operator: 'AI Assistant' }
]

// ==================== HTTP 方法推断 ====================

/** 根据 action 名称推断 HTTP 方法 */
function inferHttpMethod(actionName) {
  const n = actionName.toLowerCase()
  if (/^(get|list|search|detail|recommend|query|fetch|check)/.test(n)) return 'GET'
  if (/^(add|create|login|toggle|bind|subscribe)/.test(n)) return 'POST'
  if (/^(update|edit|modify|set|change)/.test(n)) return 'PUT'
  if (/^(delete|remove|unbind|unsubscribe|cancel)/.test(n)) return 'DELETE'
  return 'POST'
}

// ==================== JSDoc 解析 ====================

/** 清洗中文前缀 */
function cleanPrefix(val) {
  return val.replace(/^(示例|取值|格式|备注)[:：]\s*/, '').trim()
}

/** 解析 | 分隔的附加信息 */
function parseExtraFromDescription(desc, keys) {
  const parts = desc.split('|').map(s => s.trim())
  const result = {}
  keys.forEach((key, i) => {
    let val = parts[i + 1] || ''
    val = cleanPrefix(val)
    result[key] = val
  })
  result.description = parts[0] || desc
  return result
}

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

/** 从文件内容中提取第一个 JSDoc（不限位置） */
function extractTopJSDoc(content) {
  const match = content.match(/\/\*\*([\s\S]*?)\*\//)
  if (match) return match[1]
  return ''
}

/** 解析 JSDoc 文本 */
function parseJSDoc(jsdocText) {
  const result = {
    description: '',
    httpMethod: '',
    params: [],
    returns: [],
    example: ''
  }

  const lines = jsdocText.split('\n')
    .map(l => l.replace(/^\s*\*\s?/, '').trim())
    .filter(l => l && l !== '*')

  let inExample = false

  for (const line of lines) {
    if (line.startsWith('@method ')) {
      inExample = false
      result.httpMethod = line.replace('@method', '').trim().toUpperCase()
    } else if (line.startsWith('@param')) {
      inExample = false
      const paramDeclMatch = line.match(/@param\s+\{([^}]+)\}\s+(.*)/)
      if (paramDeclMatch) {
        const type = paramDeclMatch[1]
        let rest = paramDeclMatch[2].trim()

        let optional = false
        let name = ''
        let defaultVal = ''
        let descPart = ''

        if (rest.startsWith('[')) {
          optional = true
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
            descPart = rest.slice(closeIdx + 1).replace(/^\s*-\s*/, '')
          }
        } else {
          const dashIdx = rest.indexOf(' - ')
          if (dashIdx > 0) {
            name = rest.slice(0, dashIdx).trim()
            descPart = rest.slice(dashIdx + 3)
          } else {
            name = rest
            descPart = ''
          }
        }

        const extra = parseExtraFromDescription(descPart, ['valueRange', 'format', 'example', 'note'])

        result.params.push({
          type,
          isRequired: !optional,
          name,
          default: defaultVal,
          description: extra.description,
          valueRange: extra.valueRange,
          format: extra.format,
          example: extra.example,
          note: extra.note
        })
      }
    } else if (line.startsWith('@returns') || line.startsWith('@return')) {
      inExample = false
      // 解析：@returns {Type} data.field - 描述 | 类型 | 示例值 | 备注
      const returnLine = line.replace(/@returns?\s+/, '').trim()
      const typeMatch = returnLine.match(/^\{([^}]+)\}/)
      if (typeMatch) {
        const type = typeMatch[1]
        const rest = returnLine.slice(typeMatch[0].length).trim()
        // rest: "data.field - 描述 | 类型 | 示例值 | 备注"
        const dashIdx = rest.indexOf(' - ')
        let path, descPart
        if (dashIdx > 0) {
          path = rest.slice(0, dashIdx).trim()
          descPart = rest.slice(dashIdx + 3)
        } else {
          const firstSpace = rest.indexOf(' ')
          path = rest.slice(0, firstSpace > 0 ? firstSpace : rest.length).trim()
          descPart = firstSpace > 0 ? rest.slice(firstSpace).replace(/^-\s*/, '') : ''
        }
        // 按 | 分割 descPart: 描述 | 类型 | 示例值 | 备注
        const parts = descPart.split('|').map(s => s.trim())
        const description = parts[0] || ''
        const fieldType = parts[1] || '-'
        const example = parts[2] || '-'
        const note = parts[3] || '-'
        result.returns.push({
          type,
          path: path.replace(/^returns\./, ''),
          description,
          fieldType,
          example,
          note
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

// ==================== 云函数参数自动提取 ====================

/** 从值推断类型 */
function inferTypeFromValue(val) {
  val = val.trim()
  if (val === '' || /^['"].*['"]$/.test(val)) return 'String'
  if (/^\d+$/.test(val)) return 'Number'
  if (val === 'true' || val === 'false') return 'Boolean'
  if (val.startsWith('[') && val.endsWith(']')) return 'Array'
  if (val.startsWith('{') && val.endsWith('}')) return 'Object'
  return 'String'
}

/** 从 event 解构中提取参数 */
function extractEventParams(content) {
  const params = []

  // 匹配 const { page = 1, pageSize = 20, category } = event
  const destructMatch = content.match(/const\s*\{\s*([^}]+)\}\s*=\s*event/)
  if (!destructMatch) return params

  const raw = destructMatch[1]
  // 按逗号分割，但要处理对象字面量中的逗号
  const items = splitDestructItems(raw)

  for (const item of items) {
    const trimmed = item.trim()
    if (!trimmed || trimmed.startsWith('//')) continue

    // 处理展开运算符: ...updateData
    if (trimmed.startsWith('...')) {
      const name = trimmed.slice(3).trim()
      params.push({
        type: 'Object',
        isRequired: false,
        name,
        default: '',
        description: '扩展参数字段',
        valueRange: '',
        format: '',
        example: '',
        note: ''
      })
      continue
    }

    // 处理默认值: name = value
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx > 0) {
      const name = trimmed.slice(0, eqIdx).trim()
      const defaultVal = trimmed.slice(eqIdx + 1).trim()
      params.push({
        type: inferTypeFromValue(defaultVal),
        isRequired: false,
        name,
        default: defaultVal,
        description: '',
        valueRange: '',
        format: '',
        example: '',
        note: ''
      })
    } else {
      // 无默认值: 必填
      params.push({
        type: 'String',
        isRequired: true,
        name: trimmed,
        default: '',
        description: '',
        valueRange: '',
        format: '',
        example: '',
        note: ''
      })
    }
  }

  return params
}

/** 安全分割解构项（处理嵌套对象） */
function splitDestructItems(raw) {
  const items = []
  let depth = 0
  let current = ''

  for (const ch of raw) {
    if (ch === '{' || ch === '[') depth++
    else if (ch === '}' || ch === ']') depth--

    if (ch === ',' && depth === 0) {
      items.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  if (current.trim()) items.push(current)
  return items
}

/** 扫描所有云函数 action 文件 */
function scanCloudFunctions(dir) {
  const actionFiles = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === 'node_modules') continue

    const actionsDir = path.join(dir, entry.name, 'actions')
    if (!fs.existsSync(actionsDir)) continue

    const files = fs.readdirSync(actionsDir).filter(f => f.endsWith('.js'))
    files.forEach(f => {
      actionFiles.push({
        cloudFunction: entry.name,
        action: f.replace('.js', ''),
        filePath: path.join(actionsDir, f),
        relativePath: `cloudfunctions/${entry.name}/actions/${f}`
      })
    })
  }

  return actionFiles
}

/** 从 action 文件中提取错误码 */
function extractActionErrors(cloudFunction, action, errorCodesMap) {
  const actionPath = path.join(CLOUDFUNCTIONS_DIR, cloudFunction, 'actions', `${action}.js`)
  if (!fs.existsSync(actionPath)) return []

  const content = fs.readFileSync(actionPath, 'utf8')
  const errors = []

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

// ==================== 文档生成 ====================

/** 生成接口地址（REST 风格） */
function buildApiPath(cloudFunction, action) {
  return `/cloud/${cloudFunction}/${action}`
}

/** 生成 Markdown 文档 */
function generateMarkdown(docs, errorCodesMap) {
  let md = '# 养花呀 - API 接口文档\n\n'

  // 文档头信息
  md += '> **本文档由脚本自动生成，请勿手动修改**\n>\n'
  md += `> **生成时间**：${new Date().toLocaleString('zh-CN')}\n>\n`
  md += `> **文档版本**：${DOC_VERSION}\n>\n`
  md += `> **云环境 ID**：cloud1-d1gjubt747d28d4ac\n>\n`
  md += '> **说明**：本文档按 REST API 风格描述，实际调用方式为 `wx.cloud.callFunction`（无真实 HTTP 域名）\n\n'
  md += '---\n\n'

  // 目录
  md += '## 目录\n\n'
  md += '- [文档说明](#文档说明)\n'
  md += '- [请求头说明](#请求头说明)\n'
  md += '- [接口安全说明](#接口安全说明)\n'
  md += '- [接口版本管理](#接口版本管理)\n'
  md += '- [变更记录](#变更记录)\n'
  docs.forEach(service => {
    md += `- [${service.serviceName}](#${service.serviceName.toLowerCase()})\n`
    service.methods.forEach(method => {
      md += `  - [${method.name}](#${method.name.toLowerCase()})\n`
    })
  })
  md += '- [错误码总表](#错误码总表)\n'
  md += '\n---\n\n'

  // ========== 文档说明 ==========
  md += '## 文档说明\n\n'
  md += '本文档描述「养花呀」微信小程序的全部后端接口。\n\n'
  md += '**实际调用方式**：所有接口均通过微信小程序云函数调用，格式为：\n\n'
  md += '```javascript\n'
  md += "wx.cloud.callFunction({\n"
  md += "  name: '云函数名',\n"
  md += "  data: { action: '操作名', ...params }\n"
  md += '})\n'
  md += '```\n\n'
  md += '文档中接口地址以 REST 风格书写，便于前端理解接口语义。\n\n'
  md += '---\n\n'

  // ========== 请求头说明 ==========
  md += '## 请求头说明\n\n'
  md += '> 云函数调用无真实 HTTP 请求头，以下为等效概念说明。\n\n'
  md += '| 请求头 | 说明 | 示例值 |\n'
  md += '|--------|------|--------|\n'
  md += '| `Content-Type` | 请求体格式 | `application/json` |\n'
  md += '| `Authorization` | 用户身份（由微信自动注入 `_openid`，无需前端传递） | `-` |\n'
  md += '| `X-CloudBase-Env` | 云环境 ID | `cloud1-d1gjubt747d28d4ac` |\n'
  md += '| `X-Requested-With` | 请求来源 | `miniprogram` |\n\n'
  md += '---\n\n'

  // ========== 接口安全说明 ==========
  md += '## 接口安全说明\n\n'
  md += '### 访问授权\n'
  md += '- 所有云函数默认开启登录态校验，微信会自动在每个调用中注入用户的 `_openid`\n'
  md += '- 服务端从 `context.OPENID` 获取用户身份，前端无法伪造\n'
  md += '- 涉及用户数据的接口（植物、日记、收藏），服务端会校验数据归属\n\n'

  md += '### 数据传输安全\n'
  md += '- 小程序与云函数之间的通信使用微信私有协议加密传输\n'
  md += '- 不支持明文 HTTP 调用\n\n'

  md += '### 注入防护\n'
  md += '- 使用微信云数据库 SDK（服务端）进行数据库操作，自动参数化，天然防止 NoSQL 注入\n'
  md += '- 不使用字符串拼接构造查询条件\n\n'

  md += '### 敏感数据\n'
  md += '- 用户 `_openid` 由服务端自动注入，前端不可传递或修改\n'
  md += '- 用户昵称、头像等个人信息仅用于展示，不涉及第三方共享\n'
  md += '- 植物/日记数据按 `_openid` 隔离，用户只能访问自己的数据\n\n'
  md += '---\n\n'

  // ========== 接口版本管理 ==========
  md += '## 接口版本管理\n\n'
  md += `本文档采用语义化版本号：**${DOC_VERSION}**（主版本.次版本.修订号）\n\n`
  md += '- **主版本号**：不兼容的接口变更时递增\n'
  md += '- **次版本号**：新增接口或字段（向后兼容）时递增\n'
  md += '- **修订号**：接口文档修正或错误码补充（向后兼容）时递增\n\n'
  md += '当前所有接口路径为 `/cloud/{function}/{action}`，版本号体现在文档版本中。\n'
  md += '后续若发生不兼容变更，将在接口地址中加入版本号（如 `/cloud/v2/{function}/{action}`）。\n\n'
  md += '---\n\n'

  // ========== 变更记录 ==========
  md += '## 变更记录\n\n'
  md += '| 日期 | 变更描述 | 操作人 |\n'
  md += '|------|----------|--------|\n'
  DOC_CHANGE_LOG.forEach(log => {
    md += `| ${log.date} | ${log.desc} | ${log.operator} |\n`
  })
  md += '\n---\n\n'

  // ========== 接口详情 ==========
  docs.forEach(service => {
    md += `## ${service.serviceName}\n\n`
    md += `> 文件：\`${service.filePath}\`\n\n`

    service.methods.forEach(method => {
      const httpMethod = method.httpMethod || inferHttpMethod(method.action)
      const apiPath = buildApiPath(method.cloudFunction, method.action)

      md += `### ${method.name}\n\n`
      md += `**功能**：${method.description || '（暂无描述）'}\n\n`
      md += `**接口地址**：\`${apiPath}\`\n\n`
      md += `**请求方法**：\`${httpMethod}\`\n\n`
      md += `> 实际调用：\`wx.cloud.callFunction({ name: '${method.cloudFunction}', data: { action: '${method.action}'${method.params.length > 0 ? ', ...params' : ''} })\`\n\n`

      // 请求参数表格
      const displayParams = method.params.filter(p => {
        return p.name && p.name !== 'action'
      })

      if (displayParams.length > 0) {
        md += '**请求参数**：\n\n'
        md += '| 参数名 | 类型 | 是否必填 | 默认值 | 取值范围 | 参数格式 | 入参示例值 | 备注 |\n'
        md += '|--------|------|----------|--------|----------|----------|------------|------|\n'
        displayParams.forEach(p => {
          const isRequiredText = p.isRequired ? '是' : '否'
          const defaultVal = p.default || '-'
          const valueRange = p.valueRange || '-'
          const format = p.format || '-'
          const example = p.example || '-'
          const note = p.note || '-'
          md += `| ${p.name} | ${p.type} | ${isRequiredText} | ${defaultVal} | ${valueRange} | ${format} | ${example} | ${note} |\n`
        })
        md += '\n'
      } else {
        md += '**请求参数**：无\n\n'
      }

      // 标准响应结构说明
      md += '**响应说明**：\n\n'
      md += '所有接口返回格式统一为：\n\n'
      md += '```json\n'
      md += '{\n'
      md += '  "code": 0,\n'
      md += '  "message": "success",\n'
      md += '  "data": { ... }\n'
      md += '}\n'
      md += '```\n\n'
      md += '- `code`：状态码，`0` 表示成功，非 `0` 表示失败（详见错误码总表）\n'
      md += '- `message`：提示信息，成功时为 `"success"`，失败时为错误描述\n'
      md += '- `data`：业务数据，成功时返回，失败时为 `null` 或不返回\n\n'

      // 响应参数表格
      if (method.returns.length > 0) {
        md += '**响应参数（`data` 结构）**：\n\n'
        md += '| 参数名称 | 参数类型 | 参数说明 | 示例值 | 备注 |\n'
        md += '|----------|----------|----------|----------|--------|\n'
        method.returns.forEach(r => {
          const example = r.example || '-'
          const note = r.note || '-'
          md += `| ${r.path} | ${r.type} | ${r.description} | ${example} | ${note} |\n`
        })
        md += '\n'
      }

      // 正确返回示例
      md += '**正确返回示例**：\n\n'
      md += '```json\n'
      md += '{\n'
      md += '  "code": 0,\n'
      md += '  "message": "success",\n'
      if (method.returns.length > 0) {
        md += '  "data": { ... }\n'
      } else {
        md += '  "data": null\n'
      }
      md += '}\n'
      md += '```\n\n'

      // 错误码表格
      if (method.errors.length > 0) {
        md += '**可能返回的错误码**：\n\n'
        md += '| 错误码 | 错误信息 |\n'
        md += '|--------|----------|\n'
        method.errors.forEach(e => {
          md += `| ${e.code} | ${e.message} |\n`
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

  // ========== 错误码总表 ==========
  md += '## 错误码总表\n\n'
  md += '| 错误码 | 错误信息 |\n'
  md += '|--------|----------|\n'
  Object.values(errorCodesMap).forEach(ec => {
    if (ec.code !== 0) {
      md += `| ${ec.code} | ${ec.message} |\n`
    }
  })
  md += '\n'

  return md
}

/** 生成 JSON 文档 */
function generateJSON(docs, errorCodesMap) {
  return JSON.stringify({
    version: DOC_VERSION,
    updateTime: new Date().toISOString(),
    cloudEnv: 'cloud1-d1gjubt747d28d4ac',
    changeLog: DOC_CHANGE_LOG,
    services: docs.map(s => ({
      name: s.serviceName,
      file: s.filePath,
      methods: s.methods.map(m => ({
        name: m.name,
        description: m.description,
        httpMethod: m.httpMethod || inferHttpMethod(m.action),
        apiPath: buildApiPath(m.cloudFunction, m.action),
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
  console.log('📝 正在生成 API 文档 V3（后端扫描模式）...\n')

  const errorCodesMap = loadErrorCodes()
  console.log(`✅ 加载 ${Object.keys(errorCodesMap).length} 个错误码\n`)

  const actionFiles = scanCloudFunctions(CLOUDFUNCTIONS_DIR)
  console.log(`📁 扫描到 ${actionFiles.length} 个云函数 action 文件\n`)

  // 按 cloudFunction 分组
  const serviceMap = {}

  actionFiles.forEach(({ cloudFunction, action, filePath, relativePath }) => {
    const content = fs.readFileSync(filePath, 'utf8')

    // 提取顶部 JSDoc
    const jsdocText = extractTopJSDoc(content)
    const jsdoc = parseJSDoc(jsdocText)

    // 自动提取 event 参数
    const autoParams = extractEventParams(content)

    // 合并参数：JSDoc 中的参数优先，自动提取的参数补充
    const mergedParams = jsdoc.params.length > 0
      ? jsdoc.params
      : autoParams

    // 过滤掉 action 参数（这是内部调用标记，不是前端传的）
    const filteredParams = mergedParams.filter(p => p.name !== 'action')

    // 提取错误码
    const errors = extractActionErrors(cloudFunction, action, errorCodesMap)

    // 构建 service 分组
    const serviceName = cloudFunction + 'Service'
    if (!serviceMap[serviceName]) {
      serviceMap[serviceName] = {
        serviceName,
        filePath: `cloudfunctions/${cloudFunction}/actions/*.js`,
        methods: []
      }
    }

    serviceMap[serviceName].methods.push({
      name: action,
      description: jsdoc.description || action,
      httpMethod: jsdoc.httpMethod,
      params: filteredParams,
      returns: jsdoc.returns,
      example: jsdoc.example,
      cloudFunction,
      action,
      errors
    })

    console.log(`📄 解析 ${relativePath}：${filteredParams.length} 个参数，${errors.length} 个错误码`)
  })

  const docs = Object.values(serviceMap)

  console.log('\n📝 生成 Markdown 文档...')
  const mdContent = generateMarkdown(docs, errorCodesMap)
  fs.writeFileSync(path.join(DOCS_DIR, 'API接口文档.md'), mdContent, 'utf8')

  console.log('📝 生成 JSON 文档...')
  const jsonContent = generateJSON(docs, errorCodesMap)
  fs.writeFileSync(path.join(DOCS_DIR, 'API接口文档.json'), jsonContent, 'utf8')

  console.log('\n✅ API 文档 V3 已生成：')
  console.log('   📄 docs/API接口文档.md')
  console.log('   📄 docs/API接口文档.json')
}

main()
