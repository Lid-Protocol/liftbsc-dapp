import styled from 'styled-components';
import { Select as UnstyledSelect } from '@rebass/forms';

const Select = styled(UnstyledSelect)`
  border-radius: 5px;
  outline: none;
  height: 2.375rem;
  padding: 0 1rem;
  border: none !important;
  color: white !important;
  background-color: #323232 !important;
`;

export default Select;
