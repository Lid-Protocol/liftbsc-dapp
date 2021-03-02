import styled from 'styled-components';

const Button = styled.button`
  font-family: 'Open Sans', sans-serif;
  padding: 0.7rem 2rem 0.7rem 2rem;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  font-size: 1rem;
  border: none;
  outline: none;
  background: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.white};
`;

export default Button;
