/**
 * MotionStudio Utils - DOM Helpers
 * NextGen • Developed by A.K.Antal
 */

export const $ = (selector, context = document) => context.querySelector(selector);
export const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

export const on = (element, event, handler) => {
  if (element) element.addEventListener(event, handler);
};

export const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const addClass = (el, ...classes) => {
  if (el) el.classList.add(...classes);
};

export const removeClass = (el, ...classes) => {
  if (el) el.classList.remove(...classes);
};

export const toggleClass = (el, className, force) => {
  if (el) return el.classList.toggle(className, force);
};
