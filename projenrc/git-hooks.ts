import type { Project } from "projen";
import { Component, JsonFile } from "projen";
import type { NodeProject } from "projen/lib/javascript";
import { exec } from "projen/lib/util";

/**
 * Represents lint-staged configuration.
 *
 * @see {@link https://github.com/okonet/lint-staged}
 */
export class LintStaged extends Component {
  public static of(project: Project): LintStaged | undefined {
    const isLintStaged = (c: Component): c is LintStaged =>
      c instanceof LintStaged;
    return project.components.find(isLintStaged);
  }

  private readonly rules: Record<string, string[] | string> = {};
  private readonly husky: boolean = true;

  constructor(
    project: NodeProject,
    private readonly options: {
      husky?: boolean;
      rules?: Record<string, string[] | string>;
    } = {},
  ) {
    super(project);
    project.addDevDeps("lint-staged@^13");
    if (options.rules) Object.assign(this.rules, options.rules);
    project.addTask("lint-staged", {
      exec: "npx lint-staged --concurrent=false",
      cwd: this.project.outdir,
      env: { FORCE_COLOR: "1" },
    });

    // cspell:word lintstagedrc
    new JsonFile(project, ".lintstagedrc.json", {
      obj: () => ({ ...this.rules }),
      marker: false,
    });
  }

  public addRule(pattern: string, command: string[] | string) {
    this.rules[pattern] = command;
  }

  postSynthesize(): void {
    if (this.options.husky !== false)
      exec(`npx husky set .husky/pre-commit "npx projen lint-staged"`, {
        cwd: this.project.outdir,
      });
  }
}

/** @see {@link https://github.com/typicode/husky} */
export function configureGitHooks(project: NodeProject) {
  project.addDevDeps("husky");
  if (!project.tasks.tryFind("prepare")) project.addTask("prepare");
  project.tasks.tryFind("prepare")?.prependExec("husky install");
  new LintStaged(project);
}
