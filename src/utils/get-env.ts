/**
 * Return value of environment variable.
 *
 * @param   variableName - Variable name
 *
 * @returns
 *
 * @throws               With proper error message if variable is not set
 */
export function getEnv(variableName: string): string {
  const value = process.env[variableName];
  if (!value)
    throw new ReferenceError(
      `Environment variable ${variableName} is required but wasn't set.`,
    );
  return value;
}
