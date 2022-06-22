const removeImports = require("next-remove-imports")();

module.exports = removeImports({
  experimental: { esmExternals: true },
  images: {
    domains: ['s2.googleusercontent.com', 'loom.com'],
  },
  future: {
    webpack5: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/,
      loader: 'html-loader',
    });
    config.module.rules.push({
      test: /\.mp3$/,
      loader: 'file-loader',
    });
    return config
  },
});