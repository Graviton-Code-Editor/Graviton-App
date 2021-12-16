import { PropsWithChildren, useEffect, useState } from "react";
import { isTauri } from "../utils/commands";
import styled from "styled-components";

const LinkStyled = styled.a`
  color: ${({ theme }) => theme.elements.link.color};
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.elements.link.hover.color};
  }
`;

/*
 * Wrapper for <a>
 * When it runs in Tauri it will use `shell.open` instead of the default behavior
 */
export default function Link(props: PropsWithChildren<any>) {
  if (isTauri) {
    const href = props.href;
    props = { ...props, href: null };

    const [openUrl, setOpenUrl] = useState<((url: string) => Promise<void> | void) | null >(null);

    useEffect(() => {
      // Dinamically load tauri's open.shell
      import("@tauri-apps/api").then(({ shell }) => {
        setOpenUrl(shell.open);
      });
    }, []);

    return <LinkStyled onClick={() => openUrl && openUrl(href)} {...props} />;
  }
  return <LinkStyled {...props} />;
}
