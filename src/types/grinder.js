// Grinder interface/type definition
export const GrinderSchema = {
  id: null,
  name: '',
  model: '',
  notes: '',
  created_at: null,
  updated_at: null
};

// Function to validate grinder data
export const validateGrinderData = (grinderData) => {
  const errors = [];
  
  if (!grinderData.name || grinderData.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (grinderData.name && grinderData.name.length > 150) {
    errors.push('Name must be less than 150 characters');
  }
  
  if (grinderData.model && grinderData.model.length > 150) {
    errors.push('Model must be less than 150 characters');
  }
  
  return errors;
};