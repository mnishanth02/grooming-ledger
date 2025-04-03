/**
 * Extracts field-specific error messages from database errors.
 *
 * @param errorMessage The database error message
 * @returns Object containing optional field name and error message
 */
export const parseDbError = (errorMessage: string): { field?: string; message: string } => {
  // Check for unique constraint violations
  if (
    errorMessage.toLowerCase().includes("duplicate key") ||
    errorMessage.toLowerCase().includes("unique constraint")
  ) {
    // Topic name unique constraint
    if (errorMessage.toLowerCase().includes("topics_name_unique")) {
      return {
        field: "name",
        message: "A topic with this name already exists. Please choose a different name.",
      };
    }
  }

  // Default - return just the message
  return { message: errorMessage };
};
