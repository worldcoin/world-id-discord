import type { javascript } from "projen";
import type { TypeScriptProject } from "projen/lib/typescript";
import { VsCodeSettings } from "./vscode";

export const jestOptions: javascript.JestOptions = {
  jestVersion: "^28",
  junitReporting: false,
  coverageText: false,
  jestConfig: {
    coverageProvider: "v8",
    coverageReporters: ["text-summary", "lcov"],
    snapshotFormat: { escapeString: false, printBasicPrototype: false },
    setupFilesAfterEnv: ["jest-extended/all"],
  },
};

export function configureJest(project: TypeScriptProject) {
  if (!project.jest) return;

  // fix ts-jest version
  project.addDevDeps(`ts-jest@${jestOptions.jestVersion}`);
  project.addDevDeps("jest-extended");
  project.addDevDeps(`@types/jest@${jestOptions.jestVersion}`);

  // configure ESLint for Jest
  if (project.eslint) {
    project
      .tryFindObjectFile(".eslintrc.json")
      ?.addDeletionOverride("env.jest");
    project.addDevDeps(
      "eslint-plugin-jest@^26.5",
      "eslint-plugin-jest-formatting",
    );
    project.eslint.addOverride({
      files: ["**/test/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      //@ts-expect-error broken types at Projen
      env: {
        jest: true,
        "jest/globals": true,
      },
      globals: {
        jest: "off",
      },
      extends: [
        "plugin:jest/recommended",
        "plugin:jest/style",
        "plugin:jest-formatting/recommended",
      ],
      rules: {
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/unbound-method": "off",
        "jest/unbound-method": "error",

        "jest/expect-expect": [
          "error",
          {
            assertFunctionNames: [
              "expect",
              // AWS-CDK assertions - https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions-readme.html
              "**.templateMatches",
              "**.resourceCountIs",
              "**.hasResourceProperties",
              "**.hasResource",
              "**.hasOutput",
              "**.hasMapping",
              "**.findMappings",
              "**.hasCondition",
              "**.hasConditions",
              "**.hasError",
              "**.hasWarning",
              "**.hasInfo",
            ],
          },
        ],
        "jest/valid-title": "off",
        "jest/no-disabled-tests": "off",
        "jest/no-conditional-expect": "warn",
        "jest/consistent-test-it": "off",
      },
    });
  }

  VsCodeSettings.of(project)?.add({
    "jest.autoRun": "off",
    "jest.jestCommandLine": "npm test --",
  });
}
