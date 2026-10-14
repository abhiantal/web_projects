/**
 * CampusCircle Utilities - DOM Helpers
 * High-performance selector shortcuts and event delegation.
 */

export const $ = (selector, context = document) => context.querySelector(selector);
export const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

export const on = (element, event, handler, options = {}) => {
  if (!element) return;
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
};

export const delegate = (parent, selector, event, handler) => {
  if (!parent) return;
  parent.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler(e, target);
    }
  });
};

export const createElement = (tag, attributes = {}, ...children) => {
  const el = document.createElement(tag);
  Object.entries(attributes).forEach(([key, val]) => {
    if (key === 'className') {
      el.className = val;
    } else if (key === 'dataset') {
      Object.entries(val).forEach(([dKey, dVal]) => {
        el.dataset[dKey] = dVal;
      });
    } else if (key.startsWith('on') && typeof val === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), val);
    } else {
      el.setAttribute(key, val);
    }
  });

  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      el.appendChild(child);
    }
  });

  return el;
};
