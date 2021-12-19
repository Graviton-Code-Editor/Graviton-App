import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Link from "../components/link";
import { Tab } from "../modules/tab";

const WelcomeTabContainerStyled = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.elements.tab.text.color};
`;

function WelcomeTabContainer() {
  const { t } = useTranslation();

  return (
    <WelcomeTabContainerStyled>
      <h2>{t('Welcome to Graviton')}</h2>
      <p>{t('This version is still on alpha.')}</p>
      <Link href="https://github.com/Graviton-Code-Editor/Graviton-App/issues">
        {t('Report bugs here')}
      </Link>
    </WelcomeTabContainerStyled>
  );
}

class WelcomeTab extends Tab {
  constructor() {
    super("Welcome");
    this.container = () => <WelcomeTabContainer />;
  }
}

export default WelcomeTab;
