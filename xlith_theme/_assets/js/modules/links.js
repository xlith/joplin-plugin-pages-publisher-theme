/**
 * Link Enhancement Module
 * Handles dynamic link effects and smooth scrolling
 */

(function() {
  'use strict';

  // Check if already loaded
  if (window.LinkEnhancerLoaded) return;
  window.LinkEnhancerLoaded = true;

  class LinkEnhancer {
  constructor() {
    this.colors = [
      'var(--color-mint)',
      'var(--color-lilac)',
      'var(--color-sea)',
      'var(--color-peach)',
      'var(--color-pink)',
      'var(--color-green)',
      'var(--color-blue)',
      'var(--color-yellow)'
    ];

    this.init();
  }

  init() {
    this.addRandomUnderlineColors();
    this.setupSmoothScroll();
  }

  /**
   * Add random underline colors to article card links on hover
   */
  addRandomUnderlineColors() {
    const articleLinks = document.querySelectorAll('.article-card h2 a, .archive-item h3 a');

    articleLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        link.style.textDecorationColor = randomColor;
      });
    });
  }

  /**
   * Setup smooth scroll for anchor links
   */
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Get random color from palette
   * @returns {string} - CSS color variable
   */
  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }
}

  // Initialize link enhancer when DOM is ready (self-initializing)
  document.addEventListener('DOMContentLoaded', function() {
    new LinkEnhancer();
  });
})(); // End IIFE
