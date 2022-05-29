import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Link from "../components/Primitive/Link";
import { Tab } from "../modules/tab";

const WelcomeTabContainerStyled = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.elements.tab.text.color};
`;

function WelcomeTabContainer() {
  const { t } = useTranslation();

  return (
    <WelcomeTabContainerStyled>
      <h2>{t("tabs.Welcome.title")}</h2>
      <p>{t("tabs.Welcome.content")}</p>
      <Link
        href="https://github.com/Graviton-Code-Editor/Graviton-App/issues"
        label={t("Report issues")}
      />
      <br />
      <Link
        href="https://github.com/Graviton-Code-Editor/Graviton-App/issues"
        label={t("Contribute")}
      />
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

  public container() {
    return <WelcomeTabContainer />;
  }
}

export default WelcomeTab;
