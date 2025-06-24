import { z } from 'zod';

export const validateSchema = (schema, data) => {
  const response = {
    data: null,
    errors: null,
  };
  try {
    const validatedData = schema.parse(data);
    response.data = validatedData;
  } catch (error) {
    let formattedErrors = {};
    if (error instanceof z.ZodError) {
      formattedErrors = error.issues.reduce((acc, issue) => {
        const path = issue.path.join('.');
        const message = issue.message;

        // Check if path contains nested object (e.g., "business.street")
        if (path.includes('.')) {
          const [objectName, field] = path.split('.');
          acc[objectName] = acc[objectName] || {};
          acc[objectName][field] = message;
        } else {
          acc[path] = message;
        }

        return acc;
      }, {});
    }
    response.errors = formattedErrors;
  }
  return response;
};
