import styled from 'styled-components';
import { Theme } from '@components/ThemeProvider';

type StyledButtonProps = Theme<{ active?: boolean }>;

const StyledButton = styled.button.attrs({ type: 'button' })<StyledButtonProps>`
  width: 24px;
  height: 48px;
  margin: 0;
  padding: 12px 0;
  background: transparent;
  border: 0;
  outline: 0;
  fill: ${(props: StyledButtonProps) => (
    props.active
      ? props.theme.colors.accent
      : props.theme.colors.primary
  )};
  cursor: pointer;
  transition: ${(props: StyledButtonProps) => props.theme.transition};
`;

export const Control = styled(StyledButton)`
  margin-left: 10px;

  &:first-child {
    margin-left: 0;
  }
`;

export const Icon = styled.svg`
  width: 24px;
  height: 24px;
`;
