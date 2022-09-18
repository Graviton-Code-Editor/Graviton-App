import { isTauri } from "services/commands";
import styled from "styled-components";
import { PropsWithChildren } from "react";

const StyledAnchor = styled.a`
  color: ${({ theme }) => theme.elements.link.color};
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.elements.link.hover.color};
  }
`;

function openUrl(url: string) {
  import("@tauri-apps/api").then(({ shell }) => {
    shell.open(url);
  });
}

interface LinkOptions {
  href: string;
  onClick?: () => void;
}

/*
 * Wrapper for <a>
 * When it runs in Tauri it will use `shell.open` instead of the default behavior
 */
export default function Link(props: PropsWithChildren<LinkOptions>) {
  if (isTauri) {
    const href = props.href;
    props = { ...props, href: null } as any;
    return (
      <StyledAnchor
        {...props}
        onClick={() => {
          openUrl(href);
        }}
      />
    );
  }
  return <StyledAnchor {...props} />;
}
