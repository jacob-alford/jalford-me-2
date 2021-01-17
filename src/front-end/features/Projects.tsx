import styled from "styled-components";
import DS from "front-end/assets/duncan-strauss.png";
import { PageTitle } from "front-end/components/PageTitle";
import { Project, ProjectProps } from "front-end/components/Project";
import { S } from "front-end/utils/S";

const ProjectsContainer = styled.div``;

const Icon = styled.img`
  width: 50px;
  height: 50px;
`;

const projects: Array<ProjectProps> = [
  {
    title: "jalford-me-2",
    description: "This website",
    icon: DS,
    tools: [
      { icon: <Icon src={DS} alt="DS" /> },
      { icon: <Icon src={DS} alt="DS" /> },
      { icon: <Icon src={DS} alt="DS" /> }
    ]
  }
];

export const Projects = S(() => (
  <ProjectsContainer>
    <PageTitle>Projects</PageTitle>
    {projects.map(props => (
      <Project key={props.title} {...props} />
    ))}
  </ProjectsContainer>
));
