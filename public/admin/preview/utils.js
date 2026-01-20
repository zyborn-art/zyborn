// ═══════════════════════════════════════════════════════════════════════════
// ZYBORN Preview - Utility Functions
// ═══════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // Initialize global namespace
  window.ZybornPreview = window.ZybornPreview || {};

  function get(entry, path, defaultValue) {
    if (defaultValue === undefined) defaultValue = '';
    try {
      var keys = path.split('.');
      var value = entry.getIn(['data'].concat(keys));
      return (value !== undefined && value !== null) ? value : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  function toArray(immutableList) {
    if (!immutableList) return [];
    return immutableList.toJS ? immutableList.toJS() : [];
  }

  function markdownToHtml(md) {
    if (!md) return '';
    return md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*([^*]+)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/gim, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
      .replace(/\n/gim, '<br>');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function generateId() {
    return 'preview-' + Math.random().toString(36).substr(2, 9);
  }

  function getVideoEmbedUrl(url) {
    if (!url) return '';
    var ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return 'https://www.youtube.com/embed/' + ytMatch[1];
    var vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
    if (vimeoMatch) return 'https://player.vimeo.com/video/' + vimeoMatch[1];
    return url;
  }

  // Export utilities
  window.ZybornPreview.get = get;
  window.ZybornPreview.toArray = toArray;
  window.ZybornPreview.markdownToHtml = markdownToHtml;
  window.ZybornPreview.escapeHtml = escapeHtml;
  window.ZybornPreview.generateId = generateId;
  window.ZybornPreview.getVideoEmbedUrl = getVideoEmbedUrl;

  console.log('[ZYBORN Preview] Utils loaded');
})();
