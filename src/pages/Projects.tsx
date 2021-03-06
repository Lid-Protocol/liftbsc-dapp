import React from 'react';
import styled from 'styled-components';
import { STab, STabList, STabPanel, STabs } from '../components/Tab';
import CardState from '../components/CardState';
import Footer from '../components/Footer';
import Disclaimer from '../components/Disclaimer';
import InfoStatement from 'components/InfoStatement';
import CopyRight from '../components/Copyright';
import Spinner from '../components/Spinner';

import { useProjects } from 'contexts/useProjects';
import { ProjectKey } from 'utils/types';

import {
  StyledContainer as UnstyledContainer,
  StyledBody,
  TYPE
} from '../theme';
import { Flex } from 'rebass';

const Container = styled.div(
  {
    paddingTop: 40,
    width: '100%'
  },
  ({ theme }) =>
    theme.mediaWidth.upToSmall({
      paddingTop: 30
    })
);

const LayoutGrid = styled.div(
  {
    display: 'grid',
    gridGap: 70,
    gridTemplateColumns: 'repeat(3, 1fr)'
  },
  ({ theme }) => ({
    color: theme.black
  }),
  ({ theme }) =>
    theme.mediaWidth.upToSmall({
      color: theme.black,
      gridTemplateColumns: '1fr !important'
    }),
  ({ theme }) =>
    theme.mediaWidth.upToMedium({
      gridTemplateColumns: '1fr !important'
    }),
  ({ theme }) =>
    theme.mediaWidth.upToExtraLarge({
      gridTemplateColumns: 'repeat(2, 1fr)'
    })
);

const StyledContainer = styled(UnstyledContainer)({}, ({ theme }) =>
  theme.mediaWidth.upToExtraSmall({
    maxWidth: '100vw !important'
  })
);
interface ITabs {
  title: string;
  key: ProjectKey;
}

const Projects = () => {
  const { projects, loading, error } = useProjects();
  const tabs: ITabs[] = [
    { title: 'COMING SOON', key: 'inactive' },
    { title: 'ACTIVE', key: 'active' },
    { title: 'COMPLETED', key: 'completed' }
  ];

  console.log(projects, loading, error);

  return (
    <>
      <StyledBody color="bg3">
        <StyledContainer sWidth="85vw">
          <InfoStatement color="white" />
          <Container>
            <STabs
              selectedTabClassName="is-selected"
              selectedTabPanelClassName="is-selected"
              defaultIndex={1}
            >
              <STabList>
                {tabs.map((tab) => (
                  <STab key={tab.title}>
                    <TYPE.Header color="white" fontWeight="normal">
                      {tab.title}
                    </TYPE.Header>
                  </STab>
                ))}
              </STabList>
              {tabs.map((tab) => (
                <STabPanel key={tab.key}>
                  {projects[tab.key].length > 0 ? (
                    <LayoutGrid>
                      {projects[tab.key].map((project) => (
                        <CardState
                          key={project.id}
                          type={tab.key}
                          project={project}
                        />
                      ))}
                    </LayoutGrid>
                  ) : (
                    <Flex
                      height="40vh"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <TYPE.Header color="grey">
                        There are currently no projects{' '}
                        {tab.title.toLowerCase()}.
                      </TYPE.Header>
                    </Flex>
                  )}
                </STabPanel>
              ))}
            </STabs>
          </Container>

          <Disclaimer color="white" />
          <CopyRight mt="1.375rem" color="white" />

          <Spinner loading={loading} />
        </StyledContainer>
      </StyledBody>
      <Footer noBackground={false} isSimple={true} />
    </>
  );
};

export default Projects;
