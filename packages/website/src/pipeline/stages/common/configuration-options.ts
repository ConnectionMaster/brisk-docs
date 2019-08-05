export interface ProjectDocsConfig {
  // absolute path to the docs in the filesystem
  path: string;
  name: string;
  // path in the website to display these docs
  urlPath?: string;
}

export interface BriskConfiguration {
  // Absolute path to an alternative specific mdx file to use as the "Get Started" page.
  readmePath?: string;
  // Array of fields from the relevant package.json to display on the package home page. These are added to the default set.
  customPackageFields: string[];
  docs: ProjectDocsConfig[];
  packagesPaths: string[];
}

// User supplied brisk config
interface UserDocsConfig {
  name?: string;
  path?: string;
  urlPath?: string;
  description?: string;
  imgSrc?: string;
}

export interface UserConfig {
  // Absolute path to an alternative specific mdx file to use as the "Get Started" page.
  readMePath?: string;
  // Array of fields from the relevant package.json to display on the package home page. These are added to the default set.
  customPackageFields: string[];
  docs: UserDocsConfig | UserDocsConfig[];
  // Path or array of paths of packages to show. Glob patterns are allowed. e.g. `path.join(__dirname, 'packages', '*')`
  packages: string[];
}
