import { PropsWithChildren } from "react";
import styled from "styled-components";

const TabContainerStyle = styled.div``;

/* eslint-disable */
interface TabContainerOptions extends PropsWithChildren<any> {}

/* eslint-disable */
export default function TabContainer({ title, children }: TabContainerOptions) {
  return <TabContainerStyle>{children}</TabContainerStyle>;
}
