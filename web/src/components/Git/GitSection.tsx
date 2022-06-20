import styled from "styled-components";
import { basename } from "../../utils/path";
import { Card, CardContent, CardTitle } from "../Card/Card";
import { RepoSectionProps } from "./GitSection.types";

const GitCard = styled(Card)`
    width: calc(100% - 35px);
    max-width: 200px;
`;

export function RepoSection({ branch, path }: RepoSectionProps) {
  const name = basename(path);

  return (
    <div>
      <GitCard>
        <CardTitle>
          {name}
        </CardTitle>
        <CardContent>
          {branch}
        </CardContent>
      </GitCard>
    </div>
  );
}
