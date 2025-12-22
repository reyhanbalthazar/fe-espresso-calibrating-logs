// Session interface/type definition
export const SessionSchema = {
  id: null,
  bean_id: null,
  grinder_id: null,
  user_id: null,
  session_date: null,
  notes: '',
  created_at: null,
  updated_at: null
};

// Function to validate session data
export const validateSessionData = (sessionData) => {
  const errors = [];
  
  if (!sessionData.bean_id) {
    errors.push('Bean is required');
  }
  
  if (!sessionData.grinder_id) {
    errors.push('Grinder is required');
  }
  
  if (!sessionData.session_date) {
    errors.push('Session date is required');
  } else if (isNaN(Date.parse(sessionData.session_date))) {
    errors.push('Invalid session date');
  }
  
  return errors;
};