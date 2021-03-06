import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { utils } from 'ethers';
import Button from './Button';
import InputWithAddon from './InputAddon';
import { TYPE, StyledRocketCard, ExternalLink } from '../theme';
import {
  useConnectedWeb3Context,
  useContracts,
  useToken,
  useTxModal
} from '../contexts';
import { Ignitor } from 'utils/types';
import { TxStatus } from 'utils/enums';
import TermsOfUseModal from './TermsOfUseModal';
import { getContractAddress } from 'utils/networks';

const Flex = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-start;
  `}
  button {
    ${({ theme }) => theme.mediaWidth.upToSmall`
      margin: 1rem 0 0 0;
    `}
  }
`;

const StyledButton = styled(Button)`
  margin-left: 1.25rem;
  width: 150px;
`;

const StyledTokenSelector = styled.div`
  margin-top: 20px;
`;
const StyledTokenButton = styled(Button)<{ isSelected: boolean }>`
  background: ${({ isSelected }) =>
    isSelected
      ? 'linear-gradient(90deg, rgba(249,55,206,1) 0%, rgba(144,44,233,1) 100%)'
      : '#FFFFFF'};
  color: ${({ isSelected }) => (isSelected ? '#FFFFFF' : '#B4B4B4')};
  border: 1px solid #dadada;
  border-radius: 5px;
  margin-right: 10px;
`;

const StyledIgnitedBalance = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid #dadada;
  padding: 10px 15px;
  width: 250px;
  border-radius: 5px;
`;

const StyledInput = styled(InputWithAddon)({}, ({ theme }) =>
  theme.mediaWidth.upToSmall({})
);

interface IProps {
  tokenSaleId: string;
  igniteInfo: Maybe<Ignitor>;
  tokenTicker: string;
  networkId: Maybe<number>;
}

const Ignite: React.FC<IProps> = ({
  tokenSaleId,
  igniteInfo,
  tokenTicker,
  networkId
}) => {
  const [, updateTxStatus, toggleTxModal] = useTxModal();
  const context = useConnectedWeb3Context();
  const { liftoffEngine } = useContracts(context);
  const { account } = context;
  const xEthAddress = getContractAddress(networkId, 'xEth');
  const { token: xToken } = useToken(context, xEthAddress);

  const [amount, setAmount] = useState('0');
  const [isETH, setETH] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isApprovedTokens, setApprovedTokens] = useState(false);

  useEffect(() => {
    if (!xToken || !account || !liftoffEngine) {
      return;
    }

    const checkApprovedTokens = async () => {
      const balance = await xToken.getBalanceOf(account);
      const isEnoughAllowance = await xToken.hasEnoughAllowance(
        account,
        liftoffEngine.address,
        balance
      );
      setApprovedTokens(isEnoughAllowance);
    };

    checkApprovedTokens();
  }, [xToken, account, liftoffEngine]);

  const onChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const onClickIgnite = () => {
    setModalOpen(true);
  };

  const onClickUndoIgnite = async () => {
    if (!liftoffEngine) {
      return;
    }

    try {
      const txHash = await liftoffEngine.undoIgnite(tokenSaleId);
      await toggleTxModal(liftoffEngine.provider, txHash);
    } catch (error) {
      console.log(error);
      updateTxStatus(TxStatus.TX_ERROR);
    }
  };

  const onClickTokenETH = () => {
    setETH(true);
  };

  const onClickTokenXETH = () => {
    setETH(false);
  };

  const onModalClose = () => {
    setModalOpen(false);
  };

  const onModalAccept = async () => {
    setModalOpen(false);
    if (!amount || amount === '0' || !liftoffEngine || !account) {
      return;
    }
    try {
      let txHash;
      if (isETH) {
        txHash = await liftoffEngine.igniteEth(tokenSaleId, amount);
      } else {
        txHash = await liftoffEngine.ignite(tokenSaleId, account, amount);
      }
      await toggleTxModal(liftoffEngine.provider, txHash);
    } catch (error) {
      console.log(error);
      updateTxStatus(TxStatus.TX_ERROR);
    }
  };

  const onClickApprove = async () => {
    if (!xToken || !liftoffEngine || isApprovedTokens) {
      return;
    }

    try {
      await xToken.approveUnlimited(liftoffEngine.address);
    } catch (error) {
      alert(error.message || error);
      console.log(error);
    }
  };

  return (
    <>
      <StyledRocketCard>
        <TYPE.LargeHeader mb="1rem">Ignite</TYPE.LargeHeader>
        <TYPE.Body lineHeight="1.5rem">
          Ignite to add ETH to the sale, so you can claim tokens at the end.
          Full refund if softcap isn’t hit. <br />
          It automatically converts ETH to xETH.{' '}
          <ExternalLink href="https://xlock.eth.link/">
            Learn about xETH
          </ExternalLink>
        </TYPE.Body>

        <TYPE.Header mt="1.375rem">Select Token to ignite</TYPE.Header>
        <StyledTokenSelector>
          <StyledTokenButton onClick={onClickTokenETH} isSelected={isETH}>
            ETH
          </StyledTokenButton>
          <StyledTokenButton onClick={onClickTokenXETH} isSelected={!isETH}>
            xETH
          </StyledTokenButton>
        </StyledTokenSelector>
        <TYPE.Header mt="1.375rem">Amount of ETH to ignite</TYPE.Header>
        <Flex>
          <StyledInput
            placeholder="0"
            type="text"
            text="ETH"
            value={amount}
            onChange={(event) => onChangeAmount(event)}
            paddingLeft={15}
            minWidth={250}
          />
          {!isETH && !isApprovedTokens && (
            <StyledButton onClick={onClickApprove}>Approve</StyledButton>
          )}
          {(isETH || isApprovedTokens) && (
            <StyledButton onClick={onClickIgnite}>Ignite</StyledButton>
          )}
        </Flex>
        <Flex>
          <StyledIgnitedBalance>
            <TYPE.Header>Your ETH ignited</TYPE.Header>
            <TYPE.Header>
              {igniteInfo ? utils.formatEther(igniteInfo.ignited) : 0} ETH
            </TYPE.Header>
          </StyledIgnitedBalance>
          <StyledButton
            onClick={onClickUndoIgnite}
            style={{ background: '#484E5A' }}
          >
            UndoIgnite
          </StyledButton>
        </Flex>
      </StyledRocketCard>
      <TermsOfUseModal
        isOpen={isModalOpen}
        tokenTicker={tokenTicker}
        onAccept={onModalAccept}
        onClose={onModalClose}
      />
    </>
  );
};

export default Ignite;
