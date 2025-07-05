import React, { useState, useEffect } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { HiMoon } from 'react-icons/hi';
import styled from 'styled-components';

import { selectedTheme, setTheme } from '../../features/uiStatusSlice';
import { useDispatch, useSelector } from 'react-redux';
import { minimizeToTray, isIpcInitialized } from '../../ipc/ipcRenderer';
import { setThemeToSettings } from '../config';
import { isMacOS } from '../../../sharedIpc';

const Container = styled.div<{ reverse: boolean }>`
  flex-direction: ${(props) => (props.reverse ? 'row-reverse' : 'row')};
  place-content: space-between;

  background: ${(props) => props.theme.backgroundColor};
  z-index: 99;

  position: sticky;
  top: 0;
  overflow-y: auto;
  display: flex;
  font-size: 2rem;
  -webkit-app-region: drag;
  flex-shrink: 0;
  padding: 0.5rem 1rem;
`;

const StyledIconButton = styled.button<{ disabled?: boolean }>`
  font-size: 2rem;
  color: ${(props) => props.disabled ? props.theme.textColorSubtle : props.theme.textColor};
  border: none;
  cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
  background: none;
  -webkit-app-region: no-drag;
  flex-shrink: 0;
  opacity: ${(props) => props.disabled ? 0.5 : 1};

  transition: 0.25s;
  :hover {
    color: ${(props) => props.disabled ? props.theme.textColorSubtle : props.theme.textColorSubtle};
  }
`;

export const TitleBar = (): JSX.Element => {
  const themeSelected = useSelector(selectedTheme);
  const dispatch = useDispatch();
  const [ipcReady, setIpcReady] = useState(false);

  // Check IPC initialization status
  useEffect(() => {
    const checkIpcStatus = () => {
      setIpcReady(isIpcInitialized());
    };

    // Check immediately
    checkIpcStatus();

    // Set up periodic check until IPC is ready
    const interval = setInterval(() => {
      if (!ipcReady) {
        checkIpcStatus();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [ipcReady]);

  const macOs = isMacOS();

  const handleMinimizeClick = () => {
    if (ipcReady) {
      minimizeToTray();
    }
  };

  return (
    <Container reverse={macOs}>
      <StyledIconButton
        title="Switch theme dark/white"
        onClick={() => {
          const newTheme = themeSelected === 'light' ? 'dark' : 'light';
          setThemeToSettings(newTheme);
          dispatch(setTheme(newTheme));
        }}
      >
        <HiMoon />
      </StyledIconButton>

      <StyledIconButton 
        title={ipcReady ? "Minimize to tray" : "Minimize to tray (IPC not ready)"}
        disabled={!ipcReady}
        onClick={handleMinimizeClick}
      >
        <RiCloseFill />
      </StyledIconButton>
    </Container>
  );
};
