// Bean Types
export const BEAN_ROAST_LEVELS = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  DARK: 'dark',
};

// Bean interface/type definition
export const BeanSchema = {
  id: null,
  name: '',
  origin: '',
  roastery: '',
  roast_level: BEAN_ROAST_LEVELS.MEDIUM,
  roast_date: null,
  notes: '',
  is_blend: false, // Default to false (single origin)
  blendOrigins: [], // Array to store multiple origins for blends
  created_at: null,
  updated_at: null
};

// Function to validate bean data
export const validateBeanData = (beanData) => {
  const errors = [];

  if (!beanData.name || beanData.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (beanData.name && beanData.name.length > 150) {
    errors.push('Name must be less than 150 characters');
  }

  // For blends, check the combined length of all origins
  if (beanData.is_blend && Array.isArray(beanData.blendOrigins)) {
    const combinedOrigin = beanData.blendOrigins.filter(origin => origin.trim() !== '').join(', ');
    if (combinedOrigin.length > 150) {
      errors.push('Origin must be less than 150 characters');
    }
    if (combinedOrigin.trim() === '') {
      errors.push('At least one origin is required for blends');
    }
  } else if (!beanData.is_blend && beanData.origin && beanData.origin.length > 150) {
    errors.push('Origin must be less than 150 characters');
  }

  if (!beanData.is_blend && !beanData.origin) {
    errors.push('Origin is required for single origin beans');
  }

  if (beanData.roastery && beanData.roastery.length > 150) {
    errors.push('Roastery must be less than 150 characters');
  }

  if (!Object.values(BEAN_ROAST_LEVELS).includes(beanData.roast_level)) {
    errors.push('Invalid roast level');
  }

  if (beanData.roast_date && isNaN(Date.parse(beanData.roast_date))) {
    errors.push('Invalid roast date');
  }

  // Validate is_blend field
  if (typeof beanData.is_blend !== 'boolean') {
    errors.push('Bean type must be either single origin or blend');
  }

  return errors;
};