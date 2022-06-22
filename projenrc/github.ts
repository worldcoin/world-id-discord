import type { GitHubOptions } from "projen/lib/github";
import type { NodeProject } from "projen/lib/javascript";

// cspell:word mergify

export const githubOptions: GitHubOptions = {
  mergify: false,
  pullRequestLint: false,
  workflows: false, // we will use https://github.com/cdklabs/cdk-pipelines-github to create workflows
};

export function configureGitHubIntegration(project: NodeProject) {
  if (!project.github) return;
}
