import styled from "styled-components";

export const CardLayout = styled.div`
    padding: 15px;
    margin: 3px;
    width: 180px;
    height: 65px;
    display: inline-block;
    font-size: 13px;
    user-select: none;
    outline: none;
`;

export const Card = styled(CardLayout)`
    padding: 15px;
    background: ${({ theme }) => theme.elements.card.background};
    border: none;
    border-radius: 7px;
    margin: 3px;
    width: 180px;
    height: 65px;
    color: white;
    display: inline-block;
    font-size: 13px;
    user-select: none;
    border: 1px solid transparent;
    outline: none;
    &:hover {
        border: 1px solid  ${({ theme }) => theme.elements.card.hover.border};
    }
    &:focus {
        border: 1px solid  ${({ theme }) => theme.elements.card.focus.border};
    }
`;

export const CardTitle = styled.div`
    font-weight: bold;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 90%;
`;

export const CardContent = styled.div`
    color: rgb(230, 230, 230);
    margin: 5px 0px;
`;
