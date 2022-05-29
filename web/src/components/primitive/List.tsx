import styled from "styled-components";

const List = styled.ul`
  text-decoration: none;
  color: ${({ theme }) => theme.elements.list.item.color};
`;
export default List;
