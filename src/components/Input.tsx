import styled from 'styled-components';
import { Input as UnstyledInput } from '@rebass/forms';

const Input = styled(UnstyledInput)<{ error?: string }>`
  border-radius: 5px;
  outline: none;
  height: 2.375rem;
  padding: 0 1rem;
  color: white;
`;

export default Input;
