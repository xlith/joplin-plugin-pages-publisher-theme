/**
 * Tag Colorization Module
 * Handles dynamic tag coloring
 */

(function() {
  'use strict';

  // Check if already loaded
  if (window.TagColorizerLoaded) return;
  window.TagColorizerLoaded = true;

  class TagColorizer {
  constructor() {
    this.tagColorMap = {
      'mint': ['Tutorial', 'Node.js', 'Setup'],
      'lilac': ['Architecture', 'Patterns', 'ES6+'],
      'sea': ['How-To', 'Express', 'API'],
      'peach': ['Best Practices', 'Team', 'Quality'],
      'rose': ['Guide', 'Debugging'],
      'green': ['Microservices', 'DevOps'],
      'pink': ['JavaScript'],
      'blue': ['Backend', 'Database'],
      'yellow': ['Frontend', 'CSS']
    };

    this.colorClasses = [
      'tag-mint', 'tag-lilac', 'tag-sea', 'tag-peach',
      'tag-rose', 'tag-green', 'tag-pink', 'tag-blue', 'tag-yellow'
    ];

    this.init();
  }

  init() {
    this.colorizeTags();
  }

  /**
   * Get color class for a tag based on predefined mapping or hash
   * @param {string} tagText - Tag text
   * @returns {string} - Color class name
   */
  getTagColorClass(tagText) {
    // Check predefined mapping
    for (const [color, tags] of Object.entries(this.tagColorMap)) {
      if (tags.includes(tagText)) {
        return `tag-${color}`;
      }
    }

    // Default: cycle through colors based on tag text hash
    const hash = tagText.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return this.colorClasses[hash % this.colorClasses.length];
  }

  /**
   * Apply colors to all tags on the page
   */
  colorizeTags() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
      const tagText = tag.textContent.trim();
      const colorClass = this.getTagColorClass(tagText);
      tag.classList.add(colorClass);
    });
  }

  /**
   * Add custom tag mapping
   * @param {string} color - Color name
   * @param {string[]} tags - Array of tag names
   */
  addTagMapping(color, tags) {
    if (!this.tagColorMap[color]) {
      this.tagColorMap[color] = [];
    }
    this.tagColorMap[color].push(...tags);
  }
}

  // Initialize tag colorizer when DOM is ready (self-initializing)
  document.addEventListener('DOMContentLoaded', function() {
    new TagColorizer();
  });
})(); // End IIFE
