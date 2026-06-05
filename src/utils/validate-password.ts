import {
  PASSWORD_VALIDATION,
  PASSWORD_RULES_CONFIG,
} from '@/constants/constants';

export type PasswordStrength = 'weak' | 'medium' | 'strong';

type PasswordValidation = {
  strength: PasswordStrength;
  rules: string[];
  passedRules: number;
  totalRules: number;
};

export const validatePassword = (password: string): PasswordValidation => {
  if (!password) {
    return {
      strength: PASSWORD_VALIDATION.STRENGTH.WEAK,
      rules: Object.values(PASSWORD_VALIDATION.ERROR_MESSAGES),
      passedRules: 0,
      totalRules: PASSWORD_VALIDATION.TOTAL_RULES,
    };
  }

  const results = PASSWORD_RULES_CONFIG.map((rule) => ({
    ...rule,
    passed: rule.check(password),
  }));

  const passedRules = results.filter((rule) => rule.passed).length;

  let strength: PasswordStrength;
  if (passedRules >= PASSWORD_VALIDATION.STRENGTH_RULES.STRONG) {
    strength = PASSWORD_VALIDATION.STRENGTH.STRONG;
  } else if (passedRules >= PASSWORD_VALIDATION.STRENGTH_RULES.MEDIUM) {
    strength = PASSWORD_VALIDATION.STRENGTH.MEDIUM;
  } else {
    strength = PASSWORD_VALIDATION.STRENGTH.WEAK;
  }

  return {
    strength,
    rules: results.filter((rule) => !rule.passed).map((rule) => rule.text),
    passedRules,
    totalRules: results.length,
  };
};
