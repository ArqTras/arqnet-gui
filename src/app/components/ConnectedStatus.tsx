import React from 'react';
import { useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';

import {
  selectDaemonRunning,
  selectGlobalError,
  selectHasExitNodeEnabled,
  selectDaemonIsLoading,
  selectHasExitTurningOff,
  selectHasExitTurningOn
} from '../../features/statusSlice';

const ConnectedStatusContainer = styled.div`
  height: 40px;
  display: flex;
  line-height: 25px;
  margin-top: 0;

  justify-content: center;
  align-items: center;
`;

const ConnectedStatusContainerWithLogo = styled(ConnectedStatusContainer)`
  display: block;
  margin-top: 0 !important;
  height: 40px;
`;

const ConnectedStatusTitle = styled.span`
  font-family: Archivo;
  font-style: normal;
  font-weight: bold;
  font-size: 1.4rem;
  text-align: center;
`;

const ConnectedStatusLED = styled.span<{ ledColor: string }>`
  width: 1rem;
  height: 1em;
  border-radius: 50%;
  margin-left: 1rem;
  background-color: ${(props) => props.ledColor};
  flex-shrink: 0;
`;

const StyledLogoAndTitle = styled.svg`
  height: 100%;
  margin-bottom: 0;
  fill: ${(props) => props.theme.textColor};
`;

const ArqnetTitleSvg = () => {
  return (
    <ConnectedStatusContainerWithLogo>
      <StyledLogoAndTitle
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 243.8 50.5"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e0d4a4" />
            <stop offset="50%" stopColor="#c8b681" />
            <stop offset="100%" stopColor="#e0d4a4" />
          </linearGradient>
        </defs>
        <text
          x="121.9"
          y="35"
          fontFamily="sans-serif"
          fontSize="35"
          fontWeight="bold"
          fill="url(#goldGradient)"
          textAnchor="middle"
        >
          ARQNET
        </text>
      </StyledLogoAndTitle>
    </ConnectedStatusContainerWithLogo>
  );
};


export const ConnectedStatus = (): JSX.Element => {
  const theme = useTheme();

  const daemonRunning = useSelector(selectDaemonRunning);
  const daemonLoading = useSelector(selectDaemonIsLoading);
  const hasExitEnabled = useSelector(selectHasExitNodeEnabled);
  const exitTurningOff = useSelector(selectHasExitTurningOff);
  const exitTurningOn = useSelector(selectHasExitTurningOn);
  const globalError = useSelector(selectGlobalError);


  if (daemonLoading || !daemonRunning) {
    return <ArqnetTitleSvg />;
  }

  let ledColor = '';
  let statusText = '';

  if (globalError) {
    statusText =
      globalError === 'error-start-stop'
        ? 'FAILED TO START ARQNET'
        : 'UNABLE TO CONNECT';
    ledColor = theme.dangerColor;
  } else if (exitTurningOff) {
    statusText = 'DISCONNECTING';
    ledColor = theme.connectingColor;
  } else if (exitTurningOn) {
    statusText = 'CONNECTING';
    ledColor = theme.connectingColor;
  } else if (hasExitEnabled) {
    statusText = 'CONNECTED IN VPN MODE';
    ledColor = theme.connectedVpnModeColor;
  } else if (daemonRunning) {
    statusText = 'CONNECTED TO ARQNET';
    ledColor = theme.connectedArqnetColor;
  }

  return (
    <ConnectedStatusContainer>
      <ConnectedStatusTitle>{statusText}</ConnectedStatusTitle>
      <ConnectedStatusLED ledColor={ledColor} />
    </ConnectedStatusContainer>
  );
};
