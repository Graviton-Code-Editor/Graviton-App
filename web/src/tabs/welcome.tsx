import styled from "styled-components";
import Link from "../components/link";
import { Tab } from "../modules/tab";

const WelcomeTabContainerStyled = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.elements.tab.text.color};
`;

function WelcomeTabContainer() {
  return (
    <WelcomeTabContainerStyled>
      <h2>Welcome to Graviton</h2>
      <p>This version is still on alpha.</p>
      <Link href="https://github.com/Graviton-Code-Editor/Graviton-App/issues">
        Report bugs here
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
