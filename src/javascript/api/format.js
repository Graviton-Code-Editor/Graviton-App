module.exports = {
  getFormat (text) {
    switch (text.split('.').pop()) {
      case 'html':
        return {
          lang: 'html',
          format: text.split('.').pop(),
          trust: true
        }
      case 'js':
        return {
          lang: 'js',
          format: text.split('.').pop(),
          trust: true
        }
      case 'ttf':
        return {
          lang: 'unknown',
          format: text.split('.').pop(),
          trust: false
        }
      case 'css':
        return {
          lang: 'css',
          format: text.split('.').pop(),
          trust: true
        }
      case 'json':
        return {
          lang: 'json',
          format: text.split('.').pop(),
          trust: true
        }
      case 'md':
        return {
          lang: 'md',
          format: text.split('.').pop(),
          trust: true
        }
      case 'ts':
        return {
          lang: 'ts',
          format: text.split('.').pop(),
          trust: true
        }
      case 'jpg':
      case 'png':
      case 'ico':
      case 'svg':
        return {
          lang: 'image',
          format: text.split('.').pop(),
          trust: true
        }
      default:
        return {
          lang: 'unknown',
          format: text.split('.').pop(),
          trust: false
        }
    }
  },
  getLanguageName (format) {
    switch (format) {
      case 'html':
        return 'HTML'
      case 'css':
        return 'CSS'
      case 'js':
        return 'JavaScript'
      case 'jsx':
        return 'React JavaScript'
			case 'vue':
        return 'Vue.js'
      case 'json':
        return 'JSON '
      case 'go':
        return 'Go'
      case 'sql':
        return 'SQL'
      case 'rb':
      case 'ruby':
        return 'Ruby'
      case 'php':
        return 'PHP'
      case 'sass':
        return 'Sass'
      case 'dart':
        return 'Dart'
      case 'pascal':
        return 'Pascal'
      case 'md':
        return 'Markdown'
      case 'py':
        return 'Python'
      case 'sh':
        return 'Shell'
      case 'c':
      case 'ino':
      case 'h':
        return 'C'
      case 'woff2':
      case 'ttf':
        return 'Font'
      case 'cpp':
      case 'c++':
      case 'cc':
      case 'cxx':
      case 'hpp':
      case 'h++':
      case 'hh':
      case 'hxx':
        return 'C++'
      case 'csharp':
      case 'cs':
        return 'C#'
      case 'java':
        return 'Java'
      case 'm':
      case 'mm':
        return 'Objective-C'
      case 'kt':
        return 'Kotlin'
      case 'ts':
        return 'TypeScript'
      case 'toml':
      case 'rs':
        return 'Rust'
      case 'image':
        return 'Image'
      default:
        return format
    }
  },
  updateCodeMode (instance, path) {
    if (g_highlighting == 'activated') {
      switch (path.split('.').pop()) {
        case 'html':
          instance.execute('setLanguage','html')
          plang = 'HTML'
          instance.execute('forceRefresh')
          break
        case 'css':
          instance.execute('setLanguage','css')
          plang = 'CSS'
          instance.execute('forceRefresh')
          break
        case 'js':
          instance.execute('setLanguage','javascript')
          plang = 'JavaScript'
          instance.execute('forceRefresh')
          break
        case 'jsx':
          instance.execute('setLanguage','jsx')
          plang = 'React JavaScript'
          instance.execute('forceRefresh')
          break
				case 'vue':
          instance.execute('setLanguage','vue')
          plang = 'Vue.js'
          instance.execute('forceRefresh')
          break
        case 'json':
          instance.execute('setLanguage','json')
          plang = 'JSON / JavaScript'
          instance.execute('forceRefresh')
          break
        case 'go':
          instance.execute('setLanguage','go')
          plang = 'Go'
          instance.execute('forceRefresh')
          break
        case 'sql':
          instance.execute('setLanguage','aql')
          plang = 'SQL'
          instance.execute('forceRefresh')
          break
        case 'rb':
        case 'ruby':
          instance.execute('setLanguage','ruby')
          plang = 'Ruby'
          instance.execute('forceRefresh')
          break
        case 'php':
          instance.execute('setLanguage','php')
          plang = 'PHP'
          instance.execute('forceRefresh')
          break
        case 'sass':
          instance.execute('setLanguage','sass')
          plang = 'Sass'
          instance.execute('forceRefresh')
          break
        case 'dart':
          instance.execute('setLanguage','dart')
          plang = 'Dart'
          instance.execute('forceRefresh')
          break
        case 'pascal':
          instance.execute('setLanguage','pascal')
          plang = 'Pascal'
          instance.execute('forceRefresh')
          break
        case 'md':
          instance.execute('setLanguage','markdown')
          plang = 'Markdown'
          instance.execute('forceRefresh')
          break
        case 'py':
          instance.execute('setLanguage','python')
          plang = 'Python'
          instance.execute('forceRefresh')
          break
        case 'sh':
          instance.execute('setLanguage','shell')
          plang = 'Shell'
          instance.execute('forceRefresh')
          break
        case 'c':
          instance.execute('setLanguage','c')
          plang = 'C'
          instance.execute('forceRefresh')
          break
        case 'cpp':
          instance.execute('setLanguage','cpp')
          plang = 'C++'
          instance.execute('forceRefresh')
          break
        case 'cs':
          instance.execute('setLanguage','cs')
          plang = 'C#'
          instance.execute('forceRefresh')
          break
        case 'java':
          instance.execute('setLanguage','java')
          plang = 'Java'
          instance.execute('forceRefresh')
          break
        case 'h':
          instance.execute('setLanguage','objectivec')
          plang = 'Objective-C'
          instance.execute('forceRefresh')
          break
        case 'kt':
          instance.execute('setLanguage','kotlin')
          plang = 'Kotlin'
          instance.execute('forceRefresh')
          break
        case 'ts':
          instance.execute('setLanguage','typescript')
          plang = 'TypeScript'
          instance.execute('forceRefresh')
          break
        case 'toml':
        case 'rs':
          instance.execute('setLanguage','rust')
          plang = 'Rust'
          instance.execute('forceRefresh')
          break
        default:
          plang = 'Unknown'
          instance.execute('forceRefresh')
      }
    }
  }
}
