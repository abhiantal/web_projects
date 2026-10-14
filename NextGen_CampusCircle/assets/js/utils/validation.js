/**
 * CampusCircle Utilities - Validation Helpers
 * Client-side input validation for student registration, emails, and passwords.
 */

export const validators = {
  required: (val) => !!val && val.trim().length > 0,
  email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  minLength: (val, min) => typeof val === 'string' && val.length >= min,
  studentId: (val) => /^[A-Za-z0-9_-]{4,20}$/.test(val)
};

export function validateForm(formElement) {
  let isValid = true;
  const errors = {};
  const inputs = formElement.querySelectorAll('[data-validate]');

  inputs.forEach(input => {
    const rules = (input.getAttribute('data-validate') || '').split('|');
    const value = input.value.trim();
    const name = input.name || input.id;

    for (const rule of rules) {
      if (rule === 'required' && !validators.required(value)) {
        errors[name] = 'This field is required';
        isValid = false;
        break;
      }
      if (rule === 'email' && value && !validators.email(value)) {
        errors[name] = 'Invalid email address';
        isValid = false;
        break;
      }
      if (rule.startsWith('min:') && value) {
        const min = parseInt(rule.split(':')[1], 10);
        if (!validators.minLength(value, min)) {
          errors[name] = `Must be at least ${min} characters`;
          isValid = false;
          break;
        }
      }
    }
  });

  return { isValid, errors };
}
