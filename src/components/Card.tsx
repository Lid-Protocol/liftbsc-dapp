import styled from 'styled-components';
import { Box } from 'rebass';

const Card = styled(Box)<{
  padding?: string;
  borderRadius?: string;
  marginBottom?: string;
}>`
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(231, 186, 65, 0.4);
  background-color: ${({ theme }) => theme.bg1};
  border-radius: ${({ borderRadius }) => borderRadius ?? '8px'};
  margin-bottom: ${({ marginBottom }) => marginBottom};
`;

export default Card;
