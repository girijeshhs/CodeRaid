const buildLabel = (scope: string) => `[CodeRaid:${scope}]`;

export const log = {
  info(scope: string, message: string, extra?: unknown) {
    console.info(buildLabel(scope), message, extra ?? "");
  },
  warn(scope: string, message: string, extra?: unknown) {
    console.warn(buildLabel(scope), message, extra ?? "");
  },
  error(scope: string, message: string, extra?: unknown) {
    console.error(buildLabel(scope), message, extra ?? "");
  },
};
