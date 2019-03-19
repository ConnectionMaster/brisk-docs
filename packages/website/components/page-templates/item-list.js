import * as PropTypes from 'prop-types';
import Table from '@atlaskit/dynamic-table';
import styled from 'styled-components';
import Link from 'next/link';
import { gridSize } from '@atlaskit/theme';
import titleCase from 'title-case';

import NavigationWrapper from '../navigation-wrapper';
import PackageNavContent from '../navigation/package-nav-content';
import Page, { Title, Section } from '../page';
import pageInfo from '../../pages-list';

const head = {
  cells: [
    {
      key: 'name',
      content: 'Name',
      isSortable: true,
      width: 20,
    },
    {
      key: 'url',
      content: 'Url',
      shouldTruncate: true,
      isSortable: false,
      width: 45,
    },
    // { // ToDo: Nesting
    //     key: 'nesting',
    //     content: 'Nesting?',
    //     shouldTruncate: true,
    //     isSortable: false,
    //     width: 45,
    // },
  ],
};

const renderRow = item => ({
  cells: [
    {
      key: item.id,
      content: <RowCell>{titleCase(item.id)}</RowCell>,
    },
    {
      key: item.id,
      content: (
        <RowCell>
          <Link href={item.pagePath}>{item.id}</Link>
        </RowCell>
      ),
    },
    // { // ToDo: Nesting
    //     key: item.id,
    //     content: <div />,
    // },
  ],
});

// Tabular data
const RowCell = styled.div`
  padding-bottom: ${gridSize}px;
  padding-top: ${gridSize}px;
`;

const ItemList = ({ data, type }) => {
  const getRows = () => {
    const packagePages = pageInfo.packages.find(
      pkg => pkg.packageId === data.id,
    );
    return packagePages[type].map(item => renderRow(item));
  };
  const getDocsList = () => (
    <Page>
      <Title>
        {type === 'docs' ? 'Document Home Page' : 'Example Home Page'}
      </Title>
      <Section>
        <Table
          head={head}
          rows={getRows()}
          defaultSortKey="name"
          defaultSortOrder="ASC"
        />
      </Section>
    </Page>
  );

  return (
    <NavigationWrapper
      navContent={() => (
        <PackageNavContent packageId={data.id} packageName={data.packageName} />
      )}
    >
      {getDocsList()}
    </NavigationWrapper>
  );
};

ItemList.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    packageName: PropTypes.string.isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

export default ItemList;