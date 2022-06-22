import type { Project } from "projen";
import { JsonFile } from "projen";
import type { NodeProject } from "projen/lib/javascript";
import { deepMerge } from "projen/lib/util";

export class VsCodeSettings extends JsonFile {
  static readonly #fileName = ".vscode/settings.json";

  public static of(project: Project): VsCodeSettings | undefined {
    return project.tryFindObjectFile(VsCodeSettings.#fileName) as
      | VsCodeSettings
      | undefined;
  }

  constructor(
    project: NodeProject,
    private readonly settings: Record<string, unknown> = {},
  ) {
    super(project, VsCodeSettings.#fileName, {
      obj: () => this.settings,
      marker: true,
      newline: true,
    });
  }

  add(settings: Record<string, unknown>) {
    deepMerge([this.settings, settings], true);
  }
}

export function configureVSCode(project: NodeProject) {
  // settings file
  new VsCodeSettings(project, {
    "[dockerfile]": {
      "editor.defaultFormatter": "ms-azuretools.vscode-docker",
    },
    "typescript.tsdk": "node_modules/typescript/lib",
    "path-autocomplete.extensionOnImport": true,
    "json.schemaDownload.enable": true,
  });

  // recommended extensions
  new JsonFile(project, ".vscode/extensions.json", {
    newline: true,
    marker: false,
    obj: {
      recommendations: [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "github.vscode-pull-request-github",
        "streetsidesoftware.code-spell-checker",
        "orta.vscode-jest",
        "amazonwebservices.aws-toolkit-vscode",
        "ms-azuretools.vscode-docker",
        "Quidgest.vscode-velocity",
      ],
      unwantedRecommendations: [
        "DavidAnson.vscode-markdownlint",
        "GoogleCloudTools.cloudcode",
        "ms-kubernetes-tools.vscode-kubernetes-tools",
      ],
    },
  });
}
