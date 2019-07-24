import path from 'path';

import { DocPage, GenericPage } from '../common/page-specs';

export type DocsTree = {
  // Id of the root page in the tree
  id: string;
  // Metadata about the doc page
  meta: object;
  // Absolute path to the user generated markdown for this doc
  markdownPath?: string;
  // Child docs from this docs item
  children?: DocsTree[];
};

interface DocsSitemapEntry {
  // id of the root page in the sitemap entry
  id: string;
  // metadata about the root page in the sitemap entry
  meta: object;
  // path to this doc page in the website
  pagePath: string;
  // Child docs to this one
  children?: DocsSitemapEntry[];
}

// Website information about a collection of docs
interface DocsInfo {
  // The hierarchy of docs as it appears in the website
  sitemap: DocsSitemapEntry[];
  // Specs for all the pages that appear in the sitemap
  pages: {
    docsPages: DocPage[];
    docsHomePages: GenericPage[];
  };
}

const generateDocsInfo = (
  docs: DocsTree[],
  docsPath: string, // website path to the root page for where the docs will be placed
  // identifier for which docs section is being generated
  key: string,
  pageData: object = {},
): DocsInfo => {
  const docsPages: DocPage[] = [];
  const docsHomePages: GenericPage[] = [];
  const sitemap: DocsSitemapEntry[] = [];

  docs.forEach(doc => {
    const websitePath = path.join(docsPath, doc.id);

    if (doc.children) {
      // If the children contains a readme, use it as the index for this group
      // in the tree. Otherwise, create a home page to act as the index.
      const isReadme = ({ markdownPath }: DocsTree): boolean =>
        !!markdownPath && path.basename(markdownPath) === 'readme.md';
      const readme = doc.children.find(isReadme);
      const childDocs = doc.children.filter(c => !isReadme(c));

      if (readme && readme.markdownPath) {
        docsPages.push({
          websitePath,
          markdownPath: readme.markdownPath,
          pageData: { ...pageData, key },
          meta: readme.meta,
        });
      } else {
        docsHomePages.push({
          websitePath,
          pageData: {
            key,
            id: doc.id,
            children: childDocs.map(child => ({
              id: child.id,
              meta: child.meta,
              pagePath: path.join(websitePath, child.id),
            })),
          },
        });
      }

      const childDocsInfo = generateDocsInfo(
        childDocs,
        websitePath,
        key,
        pageData,
      );
      docsPages.push(...childDocsInfo.pages.docsPages);
      docsHomePages.push(...childDocsInfo.pages.docsHomePages);

      sitemap.push({
        id: doc.id,
        pagePath: websitePath,
        meta: doc.meta,
        children: childDocsInfo.sitemap,
      });
    } else if (doc.markdownPath) {
      docsPages.push({
        websitePath,
        markdownPath: doc.markdownPath,
        pageData: { ...pageData, key },
        meta: doc.meta,
      });

      sitemap.push({
        id: doc.id,
        pagePath: websitePath,
        meta: doc.meta,
      });
    }
  });

  return {
    sitemap,
    pages: {
      docsPages,
      docsHomePages,
    },
  };
};

export default generateDocsInfo;