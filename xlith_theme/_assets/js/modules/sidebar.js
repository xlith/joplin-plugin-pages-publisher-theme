/**
 * Tutorial Sidebar Module
 * Handles filtering and navigation for tutorial sidebar
 */

(function() {
  'use strict';

  // Check if already loaded
  if (window.TutorialSidebarLoaded) return;
  window.TutorialSidebarLoaded = true;

  class TutorialSidebar {
  constructor() {
    this.sidebar = document.getElementById('tutorial-sidebar');
    if (!this.sidebar) {
      console.log('Tutorial sidebar not found - not on tutorials page');
      return;
    }

    this.sidebarToggle = document.getElementById('sidebar-toggle');
    this.treeItems = document.querySelectorAll('.tree-item');
    // Look for archive-item within tutorials-list (more specific selector)
    const tutorialsList = document.getElementById('tutorials-list');
    this.tutorialItems = tutorialsList ? tutorialsList.querySelectorAll('.archive-item') : [];
    this.noResults = document.getElementById('no-results');

    console.log('Sidebar initialized:', {
      treeItems: this.treeItems.length,
      tutorialItems: this.tutorialItems.length
    });

    this.init();
  }

  init() {
    this.setupMobileToggle();
    this.setupFilterHandlers();
    this.expandAllParents();
    this.setupOutsideClickHandler();
  }

  /**
   * Setup mobile sidebar toggle functionality
   */
  setupMobileToggle() {
    if (this.sidebarToggle) {
      this.sidebarToggle.addEventListener('click', () => {
        const isOpen = this.sidebar.classList.toggle('open');
        // Update ARIA attribute for accessibility
        this.sidebarToggle.setAttribute('aria-expanded', isOpen);
      });
    }
  }

  /**
   * Filter tutorials based on selected tag
   * @param {string} filterValue - Tag to filter by ('all' or tag name)
   */
  filterTutorials(filterValue) {
    let visibleCount = 0;

    console.log('Filtering tutorials by:', filterValue);

    this.tutorialItems.forEach(item => {
      const tags = item.getAttribute('data-tags');
      const tagArray = tags ? tags.split(',').map(t => t.trim()) : [];

      console.log('Item tags:', tagArray);

      const matches = this.checkTagMatch(tagArray, filterValue);

      console.log('Match result:', matches, 'for filter:', filterValue);

      if (matches) {
        item.classList.remove('hidden');
        item.classList.add('fade-in');
        visibleCount++;
      } else {
        item.classList.add('hidden');
        item.classList.remove('fade-in');
      }
    });

    console.log('Visible items:', visibleCount);

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
   * Check if tags match the filter value
   * @param {string[]} tagArray - Array of tags
   * @param {string} filterValue - Filter to check against
   * @returns {boolean} - Whether tags match the filter
   */
  checkTagMatch(tagArray, filterValue) {
    if (filterValue === 'all') {
      return true;
    }

    // Check if any tag matches the filter
    // For sidebar tags (att-sb:), check exact match or if it's a parent category
    return tagArray.some(tag => {
      // Exact match
      if (tag === filterValue) {
        return true;
      }
      // Parent category match (tag starts with filterValue + ':')
      if (tag.startsWith(filterValue + ':')) {
        return true;
      }
      return false;
    });
  }

  /**
   * Setup click handlers for tree items
   */
  setupFilterHandlers() {
    this.treeItems.forEach(item => {
      const isParent = item.classList.contains('tree-parent');

      // For parent items, setup separate handlers for toggle icon vs item
      if (isParent) {
        const toggle = item.querySelector('.tree-toggle');

        // Click on toggle icon - just expand/collapse
        if (toggle) {
          toggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent item click
            this.toggleTreeNode(item);
          });
        }

        // Click on parent item itself - filter without toggling
        item.addEventListener('click', () => {
          const filterValue = item.getAttribute('data-filter');

          // Update active state and ARIA pressed
          this.treeItems.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
          });
          item.classList.add('active');
          item.setAttribute('aria-pressed', 'true');

          // Filter tutorials by parent category
          this.filterTutorials(filterValue);

          // Close mobile sidebar after selection
          this.closeMobileSidebar();
        });
      } else {
        // Leaf items - just filter
        item.addEventListener('click', () => {
          const filterValue = item.getAttribute('data-filter');

          // Update active state and ARIA pressed
          this.treeItems.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
          });
          item.classList.add('active');
          item.setAttribute('aria-pressed', 'true');

          // Filter tutorials
          this.filterTutorials(filterValue);

          // Close mobile sidebar after selection
          this.closeMobileSidebar();
        });
      }
    });
  }

  /**
   * Toggle tree node expansion
   * @param {HTMLElement} item - Tree item element
   */
  toggleTreeNode(item) {
    const treeNode = item.closest('.tree-node');
    const children = treeNode.querySelector('.tree-children');

    if (children) {
      const isExpanded = treeNode.classList.contains('expanded');
      treeNode.classList.toggle('expanded');

      // Use CSS class instead of inline style
      const toggle = item.querySelector('.tree-toggle');
      if (toggle) {
        toggle.classList.toggle('rotated', !isExpanded);
      }
    }
  }

  /**
   * Expand all parent nodes by default
   */
  expandAllParents() {
    document.querySelectorAll('.tree-parent').forEach(parent => {
      const treeNode = parent.closest('.tree-node');
      treeNode.classList.add('expanded');
      const toggle = parent.querySelector('.tree-toggle');
      if (toggle) {
        toggle.classList.add('rotated');
      }
    });
  }

  /**
   * Close sidebar on mobile devices
   */
  closeMobileSidebar() {
    if (window.innerWidth <= 768) {
      this.sidebar.classList.remove('open');
    }
  }

  /**
   * Setup click handler to close sidebar when clicking outside on mobile
   */
  setupOutsideClickHandler() {
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 &&
          this.sidebar.classList.contains('open') &&
          !this.sidebar.contains(e.target)) {
        this.sidebar.classList.remove('open');
      }
    });
  }
}

  // Initialize sidebar when DOM is ready (self-initializing)
  document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('tutorial-sidebar')) {
      new TutorialSidebar();
    }
  });
})(); // End IIFE
