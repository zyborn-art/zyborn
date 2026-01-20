const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

module.exports = function(eleventyConfig) {
  // ═══════════════════════════════════════════════════════════════════
  // IGNORE DISABLED FILES
  // ═══════════════════════════════════════════════════════════════════
  
  eleventyConfig.ignores.add("src/_disabled/**");

  // ═══════════════════════════════════════════════════════════════════
  // PASSTHROUGH COPY - Static assets copied as-is to _site
  // ═══════════════════════════════════════════════════════════════════
  
  // CSS, JS, Images - map from public/ to root of _site
  eleventyConfig.addPassthroughCopy({"public/css": "css"});
  eleventyConfig.addPassthroughCopy({"public/js": "js"});
  eleventyConfig.addPassthroughCopy({"public/images": "images"});
  
  // Admin panel (Decap CMS)
  eleventyConfig.addPassthroughCopy({"public/admin": "admin"});
  
  // Data files (content.json for content-loader)
  eleventyConfig.addPassthroughCopy({"public/data": "data"});
  
  // Subpages - only assets, not index.html (Eleventy generates those)
  eleventyConfig.addPassthroughCopy({"public/curatorial/images": "curatorial/images"});
  eleventyConfig.addPassthroughCopy({"public/press/images": "press/images"});
  eleventyConfig.addPassthroughCopy({"public/press/assets": "press/assets"});
  eleventyConfig.addPassthroughCopy({"public/press/press.css": "press/press.css"});
  eleventyConfig.addPassthroughCopy({"public/press/press.js": "press/press.js"});
  eleventyConfig.addPassthroughCopy({"public/bidder-verification": "bidder-verification"});
  
  // API functions (for Vercel serverless)
  eleventyConfig.addPassthroughCopy("api");
  
  // Root config files
  eleventyConfig.addPassthroughCopy("vercel.json");
  
  // Content folder images
  eleventyConfig.addPassthroughCopy("content");

  // ═══════════════════════════════════════════════════════════════════
  // GLOBAL DATA - Read CMS content files
  // ═══════════════════════════════════════════════════════════════════
  
  // Add home page data from content/pages/home.md
  eleventyConfig.addGlobalData("homeData", () => {
    try {
      const filePath = path.join(__dirname, "content/pages/home.md");
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const parsed = matter(fileContent);
        return parsed.data;
      }
    } catch (e) {
      console.warn("Could not load home.md:", e.message);
    }
    return {};
  });

  // Add curatorial page data from content/pages/curatorial.md
  eleventyConfig.addGlobalData("curatorialData", () => {
    try {
      const filePath = path.join(__dirname, "content/pages/curatorial.md");
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const parsed = matter(fileContent);
        return { ...parsed.data, content: parsed.content };
      }
    } catch (e) {
      console.warn("Could not load curatorial.md:", e.message);
    }
    return {};
  });

  // Add press page data from content/pages/press.md
  eleventyConfig.addGlobalData("pressData", () => {
    try {
      const filePath = path.join(__dirname, "content/pages/press.md");
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const parsed = matter(fileContent);
        return { ...parsed.data, content: parsed.content };
      }
    } catch (e) {
      console.warn("Could not load press.md:", e.message);
    }
    return {};
  });

  // Navigation data (available in all templates)
  eleventyConfig.addGlobalData("navigation", () => {
    try {
      const navPath = path.join(__dirname, "content/settings/navigation.json");
      if (fs.existsSync(navPath)) {
        const navData = JSON.parse(fs.readFileSync(navPath, "utf8"));
        // Filter to only visible items
        return navData.items.filter(item => item.visible !== false);
      }
    } catch (e) {
      console.warn("Could not load navigation.json:", e.message);
    }
    return [];
  });

  // Custom Pages data (manually read from content/custom-pages/)
  eleventyConfig.addGlobalData("customPagesData", () => {
    const customPagesDir = path.join(__dirname, "content/custom-pages");
    const pages = [];
    
    try {
      if (fs.existsSync(customPagesDir)) {
        const files = fs.readdirSync(customPagesDir);
        
        files.forEach(file => {
          if (file.endsWith('.md') && file !== '.gitkeep') {
            const filePath = path.join(customPagesDir, file);
            const fileContent = fs.readFileSync(filePath, "utf8");
            const parsed = matter(fileContent);
            
            // Add the page data with a data wrapper for pagination compatibility
            pages.push({
              data: {
                ...parsed.data,
                content: parsed.content
              }
            });
          }
        });
      }
    } catch (e) {
      console.warn("Could not load custom pages:", e.message);
    }
    
    return pages;
  });

  // ═══════════════════════════════════════════════════════════════════
  // FILTERS
  // ═══════════════════════════════════════════════════════════════════
  
  // Date formatting
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLLL yyyy");
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toISO();
  });

  // Markdown filter for rendering markdown in templates
  const md = new markdownIt({ html: true, breaks: true, linkify: true });
  eleventyConfig.addFilter("markdown", (content) => {
    if (!content) return "";
    return md.render(content);
  });

  // Slugify for creating URL-safe strings
  eleventyConfig.addFilter("slugify", (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  });

  // Safe filter for accessing nested properties
  eleventyConfig.addFilter("get", (obj, key) => {
    if (!obj || !key) return null;
    return key.split('.').reduce((o, k) => (o || {})[k], obj);
  });

  // ═══════════════════════════════════════════════════════════════════
  // COLLECTIONS
  // ═══════════════════════════════════════════════════════════════════
  
  // Pages collection from content/pages/
  eleventyConfig.addCollection("pages", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/pages/*.md");
  });

  // Exhibitions collection
  eleventyConfig.addCollection("exhibitions", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/exhibition/*.md");
  });

  // Auction items collection
  eleventyConfig.addCollection("auctionItems", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/auction/*.md");
  });

  // Press releases collection
  eleventyConfig.addCollection("pressReleases", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/press-releases/*.md");
  });

  // Custom Pages collection (CMS-created pages)
  eleventyConfig.addCollection("customPages", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/custom-pages/*.md");
  });

  // ═══════════════════════════════════════════════════════════════════
  // SHORTCODES
  // ═══════════════════════════════════════════════════════════════════
  
  // Year shortcode for copyright
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // ═══════════════════════════════════════════════════════════════════
  // WATCH TARGETS
  // ═══════════════════════════════════════════════════════════════════
  
  eleventyConfig.addWatchTarget("./public/css/");
  eleventyConfig.addWatchTarget("./public/js/");
  eleventyConfig.addWatchTarget("./content/");

  // ═══════════════════════════════════════════════════════════════════
  // BROWSER SYNC CONFIG (for dev server)
  // ═══════════════════════════════════════════════════════════════════
  
  eleventyConfig.setBrowserSyncConfig({
    files: ["_site/**/*"],
    open: false,
    notify: false
  });

  // ═══════════════════════════════════════════════════════════════════
  // RETURN CONFIG
  // ═══════════════════════════════════════════════════════════════════
  
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true
  };
};
