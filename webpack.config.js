const RendererConfig = require('./build/renderer_config')
const BrowserConfig = require('./build/browser_config')
const MainConfig = require('./build/main_config')
const PreloadConfig = require('./build/preload_config')
const TestConfig = require('./build/test_config')
const ServerConfig = require('./build/server_config')

module.exports = [RendererConfig, BrowserConfig, MainConfig, PreloadConfig, TestConfig, ServerConfig]
