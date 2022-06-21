import { RepoState } from "../../panels/git/git.types";

export interface RepoSectionProps {
  path: string;
  state: RepoState;
  fetchRepoState: () => void;
}
