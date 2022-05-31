import styled from "styled-components";

export const Card = styled.div`
    padding: 15px;
    background: rgb(30, 30, 30);
    border: none;
    border-radius: 7px;
    margin: 3px;
    width: 180px;
    height: 65px;
    color: white;
    display: inline-block;
    transition: 0.1s;
    font-size: 13px;
    user-select: none;
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
