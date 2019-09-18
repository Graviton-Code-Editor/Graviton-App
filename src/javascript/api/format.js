module.exports = {
   getFormat(text) {
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
   getLanguageName(format) {
      switch (format) {
         case 'html':
            return 'HTML'
         case 'css':
            return 'CSS'
         case 'js':
            return 'JavaScript'
         case 'jsx':
            return 'React JavaScript'
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
   updateCodeMode(instance, path) {
      if (g_highlighting == 'activated') {
         switch (path.split('.').pop()) {
            case 'html':
               instance.setOption('mode', 'htmlmixed')
               instance.setOption('htmlMode', true)
               plang = 'HTML'
               instance.refresh()
               break
            case 'css':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'css')
               plang = 'CSS'
               instance.refresh()
               break
            case 'js':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'javascript')
               plang = 'JavaScript'
               instance.refresh()
               break
            case 'jsx':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'jsx')
               plang = 'React JavaScript'
               instance.refresh()
               break
            case 'json':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'application/json')
               plang = 'JSON / JavaScript'
               instance.refresh()
               break
            case 'go':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'go')
               plang = 'Go'
               instance.refresh()
               break
            case 'sql':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'sql')
               plang = 'SQL'
               instance.refresh()
               break
            case 'rb':
            case 'ruby':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'ruby')
               plang = 'Ruby'
               instance.refresh()
               break
            case 'php':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'php')
               plang = 'PHP'
               instance.refresh()
               break
            case 'sass':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'sass')
               plang = 'Sass'
               instance.refresh()
               break
            case 'dart':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'dart')
               plang = 'Dart'
               instance.refresh()
               break
            case 'pascal':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'pascal')
               plang = 'Pascal'
               instance.refresh()
               break
            case 'md':
               instance.setOption('htmlMode', true)
               instance.setOption('mode', 'markdown')
               plang = 'Markdown'
               instance.refresh()
               break
            case 'py':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'python')
               plang = 'Python'
               instance.refresh()
               break
            case 'sh':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'shell')
               plang = 'Shell'
               instance.refresh()
               break
            case 'c':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'text/x-csrc')
               plang = 'C'
               instance.refresh()
               break
            case 'cpp':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'text/x-c++src')
               plang = 'C++'
               instance.refresh()
               break
            case 'cs':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'text/x-csharp')
               plang = 'C#'
               instance.refresh()
               break
            case 'java':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'text/x-java')
               plang = 'Java'
               instance.refresh()
               break
            case 'h':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'text/x-objectivec')
               plang = 'Objective-C'
               instance.refresh()
               break
            case 'kt':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'text/x-kotlin')
               plang = 'Kotlin'
               instance.refresh()
               break
            case 'ts':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'application/typescript')
               plang = 'TypeScript'
               instance.refresh()
               break
            case 'toml':
            case 'rs':
               instance.setOption('htmlMode', false)
               instance.setOption('mode', 'rust')
               plang = 'Rust'
               instance.refresh()
               break
            default:
               plang = 'Unknown'
               instance.refresh()
         }
      }
   }
}