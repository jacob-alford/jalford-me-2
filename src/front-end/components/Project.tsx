import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import * as Eq from "fp-ts/lib/Eq";
import * as A from "fp-ts/lib/Array";
import { AppIcon } from "front-end/components/AppIcon";
import { C } from "front-end/utils/C";
import { C as Cs } from "front-end/styles/C";
import { constEqTrue } from "utils/constEqTrue";

const ProjectContainer = styled.div`
  background-color: ${Cs.container};
  padding: ${Cs.spacing(0)};
  border-radius: ${Cs.border_radius};
`;

const TextIcon = styled.div`
  display: flex;
  flex-flow: row wrap-reverse;
  justify-content: space-between;
  align-items: center;
`;

const TitleDesc = styled.div``;

const Tools = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
`;

const Tool = styled.div`
  width: 50px;
  height: 50px;
  margin: 12px;
`;

interface Tech {
  icon: JSX.Element;
}

const eqTech: Eq.Eq<Tech> = Eq.getStructEq({
  icon: constEqTrue()
});

export interface ProjectProps {
  title: string;
  description: string;
  tools: Array<Tech>;
  icon: string;
}

const eqProjectProps: Eq.Eq<ProjectProps> = Eq.getStructEq({
  title: Eq.eqString,
  description: Eq.eqString,
  tools: A.getEq(eqTech),
  icon: constEqTrue()
});

export const Project = C<ProjectProps>(
  eqProjectProps,
  ({ title, description, tools, icon }) => (
    <ProjectContainer>
      <TextIcon>
        <TitleDesc>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="body1">{description}</Typography>
        </TitleDesc>
        <AppIcon
          background={Cs.container_alt}
          width={50}
          height={50}
          src={icon}
          alt={title}
          onClick={() => {}}
        />
      </TextIcon>
      <Tools>
        {tools.map(({ icon }) => (
          <Tool key={Math.random().toString(36)}>{icon}</Tool>
        ))}
      </Tools>
    </ProjectContainer>
  )
);
