import { ReactSVG } from "react-svg";
import styled from "styled-components";

const CloseTabIndicator = styled(ReactSVG)`
  & svg {
    height: 10px;
    width: 10px; 
    & path {
        stroke: ${({ theme }) => theme.elements.tab.button.indicator.fill};
    }
  }
  &:hover svg > path {
    stroke: ${({ theme }) => theme.elements.tab.button.indicator.hover.fill};
  }
`;

export default CloseTabIndicator;
