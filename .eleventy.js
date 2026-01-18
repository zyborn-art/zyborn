const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  // ═══════════════════════════════════════════════════════════════════
  // PASSTHROUGH COPY - Static assets copied as-is to _site
  // Using object syntax: { "source": "destination" }
  // ═══════════════════════════════════════════════════════════════════
  
  // CSS, JS, Images - map from public/ to root of _site
  eleventyConfig.addPassthroughCopy({"public/css": "css"});
  eleventyConfig.addPassthroughCopy({"public/js": "js"});
  eleventyConfig.addPassthroughCopy({"public/images": "images"});
  
  // Admin panel (Decap CMS)
  eleventyConfig.addPassthroughCopy({"public/admin": "admin"});
  
  // Data files (content.json for content-loader)
  eleventyConfig.addPassthroughCopy({"public/data": "data"});
  
  // Subpages with their assets
  eleventyConfig.addPassthroughCopy({"public/curatorial": "curatorial"});
  eleventyConfig.addPassthroughCopy({"public/press": "press"});
  eleventyConfig.addPassthroughCopy({"public/bidder-verification": "bidder-verification"});
  
  // API functions (for Vercel serverless)
  eleventyConfig.addPassthroughCopy("api");
  
  // Root config files
  eleventyConfig.addPassthroughCopy("vercel.json");
  
  // Content folder (for CMS-managed markdown)
  eleventyConfig.addPassthroughCopy("content");

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
