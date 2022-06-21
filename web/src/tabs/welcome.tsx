import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { CardLayout, CardTitle } from "../components/Card/Card";
import { SecondaryButton } from "../components/Primitive/Button";
import Link from "../components/Primitive/Link";
import useTextEditorTab from "../hooks/useTextEditorTab";
import { Tab } from "../modules/tab";
import { foldersState } from "../utils/state";
import { openFileSystemPicker } from "../services/commands";

const WelcomeTabContainerStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  height: 100%;
  width: 100%;
  overflow: auto;
  font-size: 13px;
  color: ${({ theme }) => theme.elements.tab.text.color};
`;

const WelcomeContent = styled.div`
  height: 80%;
  max-width: 85%;
`;

const WelcomeCardsView = styled.div`
  display: flex;
  justify-content: center;
`;

const WelcomeCard = styled(CardLayout)`
  height: auto;
`;

function WelcomeTabContainer({ close }: { close: () => void }) {
  const { t } = useTranslation();
  const setOpenedFolders = useSetRecoilState(foldersState);
  const { pushTextEditorTab } = useTextEditorTab();

  async function openFile() {
    const openedFile = await openFileSystemPicker("local", "file");
    // If a file selected
    if (openedFile != null) {
      // Clear all opened folders and open the selected one
      pushTextEditorTab(openedFile, "local");
      close();
    }
  }

  async function openFolder() {
    const openedFolder = await openFileSystemPicker("local", "folder");
    // If a folder selected
    if (openedFolder != null) {
      // Clear all opened folders and open the selected one
      setOpenedFolders([
        {
          path: openedFolder,
          filesystem: "local",
        },
      ]);
      close();
    }
  }

  return (
    <WelcomeTabContainerStyled>
      <WelcomeContent>
        <h2>{t("Graviton Editor")}</h2>
        <p>{t("tabs.Welcome.content")}</p>
        <WelcomeCardsView>
          <WelcomeCard>
            <CardTitle>Work</CardTitle>
            <SecondaryButton expanded={true} onClick={openFolder}>
              {t("prompts.Global.OpenFolder")}
            </SecondaryButton>
            <br />
            <SecondaryButton expanded={true} onClick={openFile}>
              {t("prompts.Global.OpenFile")}
            </SecondaryButton>
          </WelcomeCard>
          <WelcomeCard>
            <CardTitle>Contribute</CardTitle>
            <Link href="https://github.com/Graviton-Code-Editor/Graviton-App/issues">
              <SecondaryButton expanded={true}>
                {t("Report issues")}
              </SecondaryButton>
            </Link>
            <br />
            <Link href="https://github.com/Graviton-Code-Editor/Graviton-App/issues">
              <SecondaryButton expanded={true}>
                {t("Contribute")}
              </SecondaryButton>
            </Link>
          </WelcomeCard>
        </WelcomeCardsView>
      </WelcomeContent>
    </WelcomeTabContainerStyled>
  );
}

/**
 * A Tab that displays a Welcome message
 */
class WelcomeTab extends Tab {
  constructor() {
    super("Welcome");
  }

  public container({ close }: { close: () => void }) {
    return <WelcomeTabContainer close={close} />;
  }
}

export default WelcomeTab;
