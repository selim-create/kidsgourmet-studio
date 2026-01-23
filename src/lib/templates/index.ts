export { RECIPE_TEMPLATES } from './recipeTemplates';
export { BLOG_TEMPLATES } from './blogTemplates';
export { INGREDIENT_TEMPLATES } from './ingredientTemplates';

import { RECIPE_TEMPLATES } from './recipeTemplates';
import { BLOG_TEMPLATES } from './blogTemplates';
import { INGREDIENT_TEMPLATES } from './ingredientTemplates';

// Tüm şablonları birleştir
export const ALL_TEMPLATES = [
  ...RECIPE_TEMPLATES,
  ...BLOG_TEMPLATES,
  ...INGREDIENT_TEMPLATES
];

// Şablon kategorilerinin sayıları
export const TEMPLATE_COUNTS = {
  recipe: RECIPE_TEMPLATES.length,
  blog: BLOG_TEMPLATES.length,
  guide: INGREDIENT_TEMPLATES.length,
  total: ALL_TEMPLATES.length
};
