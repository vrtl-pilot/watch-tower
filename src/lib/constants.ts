export const ENVIRONMENTS = [
  "Development",
  "Test01",
  "Test02",
  "QA01",
  "QA02",
  "Production",
] as const;

export type Environment = (typeof ENVIRONMENTS)[number];

export const DEFAULT_ENVIRONMENT: Environment = "Production";