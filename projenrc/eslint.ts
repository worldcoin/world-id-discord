/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { javascript } from "projen";
import type { TypeScriptProject } from "projen/lib/typescript";
import { LintStaged } from "./git-hooks";
import { VsCodeSettings } from "./vscode";

/** @see {@link https://github.com/projen/projen/blob/master/src/javascript/eslint.ts} */

export const eslintOptions: javascript.EslintOptions = {
  prettier: false,
  dirs: ["src"],
  devdirs: ["test", "projenrc"],
};

export function configureESLint(project: TypeScriptProject) {
  // remove extra deps
  for (const redundantDependency of [
    "eslint-import-resolver-node",
    "eslint-import-resolver-typescript",
    "eslint-plugin-import",
    "json-schema",
    "eslint-plugin-prettier",
  ])
    project.deps.removeDependency(redundantDependency);

  const eslint = project.eslint!;
  const eslintRc = project.tryFindObjectFile(".eslintrc.json")!;
  // removing unwanted extends
  const eslintExtends: string[] = eslint.config.extends();
  const pluginImportExtends = eslintExtends.findIndex((v) =>
    v.startsWith("plugin:import/"),
  );
  if (pluginImportExtends >= 0) eslintExtends.splice(pluginImportExtends);

  eslint.addExtends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  );

  Object.keys(eslint.config.settings).forEach((setting) => {
    if (setting.startsWith("import/"))
      eslintRc.addDeletionOverride(`settings.${setting}`);
  });
  eslintRc.addDeletionOverride("parser");

  // removing unwanted plugins
  const plugins: string[] = eslint.config.plugins();
  for (let i = plugins.length - 1; i >= 0; i--)
    if (["@typescript-eslint", "import"].includes(plugins[i]))
      plugins.splice(i);

  eslintRc.addOverride("parserOptions.ecmaVersion", 2022);

  project.addDevDeps("eslint-plugin-tsdoc");
  eslint.addPlugins("tsdoc");
  eslint.addRules({ "tsdoc/syntax": "warn" });

  eslintRc.addDeletionOverride("rules.prettier/prettier");
  eslintRc.addDeletionOverride("rules.key-spacing");
  eslintRc.addDeletionOverride("rules.no-bitwise");
  eslintRc.addDeletionOverride("rules.no-trailing-spaces");
  eslintRc.addDeletionOverride("rules.no-duplicate-imports");
  eslintRc.addDeletionOverride("rules.no-multiple-empty-lines");
  Object.keys(eslint.rules).forEach((rule) => {
    if (rule.startsWith("import/"))
      eslintRc.addDeletionOverride(`rules.${rule}`);
  });

  eslint.addRules({
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/dot-notation": "warn",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",

    // Require use of the `import { foo } from 'bar';` form instead of `import foo = require('bar');`
    "@typescript-eslint/no-require-imports": ["error"],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports", disallowTypeAnnotations: false },
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true,
        caughtErrors: "all",
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/unbound-method": ["error", { ignoreStatic: true }],
    "@typescript-eslint/no-namespace": ["warn", { allowDeclarations: true }],
    "@typescript-eslint/no-empty-interface": [
      "error",
      {
        allowSingleExtends: true,
      },
    ],
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
    "@typescript-eslint/no-unnecessary-condition": "warn",
    "@typescript-eslint/non-nullable-type-assertion-style": "warn",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-includes": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-reduce-type-parameter": "error",
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    "@typescript-eslint/promise-function-async": [
      "error",
      { checkArrowFunctions: false },
    ],
    "@typescript-eslint/sort-type-union-intersection-members": "warn",

    "sort-imports": "off", // we use TypeScripts' organize imports feature
  });

  LintStaged.of(project)?.addRule("*.{ts,tsx}", "eslint --cache --fix");

  VsCodeSettings.of(project)?.add({
    "editor.codeActionsOnSave": {
      "source.fixAll": true,
    },
    "eslint.useESLintClass": true,
    "eslint.options": {
      cache: true,
      reportUnusedDisableDirectives: "error",
    },
  });
}
