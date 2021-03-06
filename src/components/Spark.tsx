import React, { FC } from 'react';
import styled from 'styled-components';
import Button from './Button';
import { StyledRocketCard, TYPE } from '../theme';
import { useConnectedWeb3Context, useContracts, useTxModal } from '../contexts';
import { TxStatus } from 'utils/enums';

const CTA = styled.div`
  display: flex;
  align-items: center;
  padding-top: 1rem;
  button {
    margin-right: 1rem;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-content: space-between;
  `}
`;

const StyledButton = styled(Button)``;

interface IProps {
  tokenSaleId: string;
}

const Spark: FC<IProps> = ({ tokenSaleId }) => {
  const [, updateTxStatus, toggleTxModal] = useTxModal();
  const context = useConnectedWeb3Context();
  const { liftoffEngine } = useContracts(context);

  const onClickSpark = async () => {
    if (!liftoffEngine) {
      return;
    }
    try {
      const txHash = await liftoffEngine.spark(tokenSaleId);
      await toggleTxModal(liftoffEngine.provider, txHash);
    } catch (error) {
      console.log(error);
      updateTxStatus(TxStatus.TX_ERROR);
    }
  };

  return (
    <>
      <StyledRocketCard>
        <TYPE.LargeHeader mb="1rem">Spark Project</TYPE.LargeHeader>
        <TYPE.Body lineHeight="1.5rem">
          Spark to initiate the token on both PenguinSwap and LiftoffInsurance.
        </TYPE.Body>
        <CTA>
          <StyledButton onClick={onClickSpark}>Spark</StyledButton>
        </CTA>
      </StyledRocketCard>
    </>
  );
};

export default Spark;
