// Shot interface/type definition
export const ShotSchema = {
  id: null,
  calibration_session_id: null,
  shot_number: 1,
  grind_setting: '',
  dose: null,
  yield: null,
  time_seconds: null,
  water_temperature: null, // New field
  taste_notes: '',
  action_taken: '',
  created_at: null,
  updated_at: null
};

// Function to validate shot data
export const validateShotData = (shotData) => {
  const errors = [];
  
  if (!shotData.calibration_session_id) {
    errors.push('Session is required');
  }
  
  if (shotData.shot_number === null || shotData.shot_number === undefined) {
    errors.push('Shot number is required');
  } else if (isNaN(shotData.shot_number) || shotData.shot_number < 1) {
    errors.push('Shot number must be a positive number');
  }
  
  if (!shotData.grind_setting || shotData.grind_setting.trim().length === 0) {
    errors.push('Grind setting is required');
  }
  
  if (shotData.dose === null || shotData.dose === undefined) {
    errors.push('Dose is required');
  } else if (isNaN(shotData.dose) || shotData.dose <= 0) {
    errors.push('Dose must be a positive number');
  } else if (shotData.dose > 999.99) {
    errors.push('Dose must be less than or equal to 999.99');
  }
  
  if (shotData.yield === null || shotData.yield === undefined) {
    errors.push('Yield is required');
  } else if (isNaN(shotData.yield) || shotData.yield <= 0) {
    errors.push('Yield must be a positive number');
  } else if (shotData.yield > 999.99) {
    errors.push('Yield must be less than or equal to 999.99');
  }
  
  if (shotData.time_seconds === null || shotData.time_seconds === undefined) {
    errors.push('Time (seconds) is required');
  } else if (isNaN(shotData.time_seconds) || shotData.time_seconds <= 0) {
    errors.push('Time must be a positive number');
  } else if (!Number.isInteger(shotData.time_seconds)) {
    errors.push('Time must be a whole number');
  }
  
  // Validate water temperature if provided
  if (shotData.water_temperature !== null && shotData.water_temperature !== undefined && shotData.water_temperature !== '') {
    if (isNaN(shotData.water_temperature) || shotData.water_temperature <= 0) {
      errors.push('Water temperature must be a positive number');
    } else if (shotData.water_temperature > 100) {
      errors.push('Water temperature should be below 100°C (boiling point)');
    }
  }

  return errors;
};