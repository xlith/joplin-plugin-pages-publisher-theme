/**
 * Animation Module
 * Handles entrance animations for cards and elements
 */

(function() {
  'use strict';

  // Check if already loaded
  if (window.AnimationControllerLoaded) return;
  window.AnimationControllerLoaded = true;

  class AnimationController {
  constructor(options = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      staggerDelay: 0.1,
      ...options
    };

    this.observer = null;
    this.init();
  }

  init() {
    this.setupObserver();
    this.observeElements();
  }

  /**
   * Setup intersection observer for entrance animations
   */
  setupObserver() {
    const observerOptions = {
      threshold: this.options.threshold,
      rootMargin: this.options.rootMargin
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          this.observer.unobserve(entry.target); // Stop observing after animation
        }
      });
    }, observerOptions);
  }

  /**
   * Observe cards for entrance animation
   */
  observeElements() {
    const cards = document.querySelectorAll('.article-card, .archive-item');
    cards.forEach((card, index) => {
      card.classList.add('fade-in-element');
      card.style.transitionDelay = `${index * this.options.staggerDelay}s`;
      this.observer.observe(card);
    });
  }

  /**
   * Clean up observer
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

  // Initialize animations when DOM is ready (self-initializing)
  document.addEventListener('DOMContentLoaded', function() {
    new AnimationController();
  });
})(); // End IIFE
