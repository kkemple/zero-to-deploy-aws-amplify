import { css } from "emotion";

export const containerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  min-height: 100vh;
  background: #f857a6;
  background: -webkit-linear-gradient(to bottom, #ff5858, #f857a6);
  background: linear-gradient(to bottom, #ff5858, #f857a6);
  padding: 32px;
`;

export const titleStyles = css`
  margin: 0;
  font-weight: 300;
`;

export const inputStyles = css`
  border: 1px solid #f857a6;
  color: #f857a6;
  padding: 8px;
  margin-bottom: 24px;
  border-radius: 4px;
`;

export const dividerStyles = css`
  height: 1px;
  background-color: #f857a6;
  margin-bottom: 24px;
`;
