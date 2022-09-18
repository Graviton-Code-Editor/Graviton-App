import styled from "styled-components";
import { useContextMenu } from "hooks";
import { basename } from "utils/path";
import { join } from "path";
import { Card, CardContent, CardTitle } from "components/Card/Card";
import ExplorerItem from "modules/side_panels/explorer/components/ExplorerItem";
import FileIcon from "modules/side_panels/explorer/components/FileIcon";
import { RepoState } from "../git.types";

const GitCard = styled(Card)`
    width: calc(100% - 40px);
    height: auto;
`;

const GitExplorerItem = styled(ExplorerItem)`
  min-width: 100%;
  & > span:nth-child(1) {
    margin-left: 15px;
    margin-right: 5px;
    text-overflow: unset;
    min-width: 17px;
    max-width: 17px;
    text-align: center;
  }
  & .file svg {
    max-width: 20px;
    max-height: 20px;
    padding-left: 0px;
  }
`;

export interface RepoSectionProps {
  path: string;
  state: RepoState;
  fetchRepoState: () => void;
}

export function RepoSection(
  { state, path: repoPath, fetchRepoState }: RepoSectionProps,
) {
  const name = basename(repoPath);
  const { branch, files_states } = state;
  const { pushContextMenu } = useContextMenu();

  function repoContextMenu(ev: React.MouseEvent) {
    pushContextMenu({
      x: ev.pageX,
      y: ev.pageY,
      menus: [
        {
          label: {
            text: "Refresh",
          },
          action() {
            fetchRepoState();
            return false;
          },
        },
      ],
    });
  }

  return (
    <div>
      <GitCard onContextMenu={repoContextMenu}>
        <CardTitle>
          {name}
        </CardTitle>
        <CardContent>
          Branch: {branch}
        </CardContent>
        {files_states.map(({ path: relativePath, status }) => {
          const name = basename(relativePath);
          const path = join(repoPath, relativePath);

          function itemContextMenu(ev: React.MouseEvent) {
            pushContextMenu({
              x: ev.pageX,
              y: ev.pageY,
              menus: [
                {
                  label: {
                    text: "CopyPath",
                  },
                  action() {
                    navigator.clipboard.writeText(path);
                    return false;
                  },
                },
              ],
            });
            ev.preventDefault();
            ev.stopPropagation();
          }

          return (
            <GitExplorerItem
              recentlyOpened={false}
              recentlyOpenedItems={false}
              key={path}
              onContextMenu={itemContextMenu}
              title={path}
              isFile={true}
              isOpened={false}
            >
              <span>{status.char}</span>
              <FileIcon item={{ name, isFile: true }} isOpened={false} />
              <span>{name} · {relativePath}</span>
            </GitExplorerItem>
          );
        })}
      </GitCard>
    </div>
  );
}
