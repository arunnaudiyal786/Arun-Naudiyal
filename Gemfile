source "https://rubygems.org"

# Jekyll core
gem "jekyll", "~> 4.3.0"

# Essential plugins
gem "jekyll-feed", "~> 0.17"
gem "jekyll-sitemap", "~> 1.4"
gem "jekyll-seo-tag", "~> 2.8"

# Development dependencies
gem "webrick", "~> 1.7" # Required for Ruby 3.0+
gem "logger", "~> 1.5" # Required for Ruby 3.4+
gem "csv", "~> 3.2" # Required for Ruby 3.4+
gem "base64", "~> 0.2" # Required for Ruby 3.4+

# Optional: If you want to deploy to GitHub Pages later, uncomment this
# gem "github-pages", group: :jekyll_plugins

# Windows and JRuby compatibility
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
