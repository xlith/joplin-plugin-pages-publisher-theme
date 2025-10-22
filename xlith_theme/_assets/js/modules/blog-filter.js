/**
 * Blog Filter Module
 * Handles tag-based filtering for blog articles
 */

(function() {
  'use strict';

  // Check if already loaded
  if (window.BlogFilterLoaded) return;
  window.BlogFilterLoaded = true;

  class BlogFilter {
    constructor() {
      this.filterTags = document.querySelectorAll('.filter-tag');
      // Look for archive-item within blog-list (more specific selector)
      const blogList = document.getElementById('blog-list');
      this.blogItems = blogList ? blogList.querySelectorAll('.archive-item') : [];
      this.noResults = document.getElementById('blog-no-results');

      console.log('Blog filter initialized:', {
        filterTags: this.filterTags.length,
        blogItems: this.blogItems.length,
        blogListExists: !!blogList
      });

      if (this.filterTags.length === 0 || this.blogItems.length === 0) {
        console.log('Blog filter not active - missing elements');
        return; // Not on blog page or no items
      }

      this.init();
    }

    init() {
      this.setupFilterHandlers();
    }

    /**
     * Filter blog posts by tag
     * @param {string} tagFilter - Tag to filter by ('all' or tag name)
     */
    filterBlogPosts(tagFilter) {
      let visibleCount = 0;

      this.blogItems.forEach(item => {
        const tags = item.getAttribute('data-tags');
        const tagArray = tags ? tags.split(',') : [];

        let matches = false;

        if (tagFilter === 'all') {
          matches = true;
        } else {
          matches = tagArray.includes(tagFilter);
        }

        if (matches) {
          item.classList.remove('hidden');
          item.classList.add('fade-in');
          visibleCount++;
        } else {
          item.classList.add('hidden');
          item.classList.remove('fade-in');
        }
      });

      // Show/hide no results message
      if (this.noResults) {
        if (visibleCount === 0) {
          this.noResults.classList.remove('hidden');
        } else {
          this.noResults.classList.add('hidden');
        }
      }
    }

    /**
     * Setup click handlers for filter tags
     */
    setupFilterHandlers() {
      this.filterTags.forEach(button => {
        button.addEventListener('click', () => {
          const tagFilter = button.getAttribute('data-tag');

          // Update active state and ARIA attributes
          this.filterTags.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
          });
          button.classList.add('active');
          button.setAttribute('aria-selected', 'true');

          // Filter blog posts
          this.filterBlogPosts(tagFilter);
        });
      });
    }
  }

  // Initialize blog filter when DOM is ready (self-initializing)
  document.addEventListener('DOMContentLoaded', function() {
    new BlogFilter();
  });
})(); // End IIFE
