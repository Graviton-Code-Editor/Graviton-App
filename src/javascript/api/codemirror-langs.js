module.exports = {
   /*
    * Organized way of requiring all codemirror dependencies
    */
   langs() {
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'addon', 'mode', 'simple.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'clike', 'clike.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'css', 'css.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'xml', 'xml.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'javascript', 'javascript.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'jsx', 'jsx.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'htmlmixed', 'htmlmixed.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'markdown', 'markdown.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'go', 'go.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'dart', 'dart.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'pascal', 'pascal.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'php', 'php.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'ruby', 'ruby.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'sql', 'sql.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'sass', 'sass.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'python', 'python.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'shell', 'shell.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'mode', 'rust', 'rust.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'addon', 'dialog', 'dialog.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'addon', 'search', 'jump-to-line.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'addon', 'search', 'match-highlighter.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'addon', 'search', 'matchesonscrollbar.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'addon', 'search', 'search.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'addon', 'search', 'searchcursor.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'addon', 'scroll', 'annotatescrollbar.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'addon', 'scroll', 'scrollpastend.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'addon', 'scroll', 'simplescrollbars.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'addon', 'edit', 'closebrackets.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'addon', 'edit', 'matchbrackets.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'addon', 'edit', 'matchtags.js'))
      require(path.join(__dirname, '..', '..', '..', 'node_modules', 'codemirror', 'addon', 'selection', 'active-line.js'))
   }
}