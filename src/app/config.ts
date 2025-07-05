import {
  DEFAULT_EXIT_NODE,
  getDefaultOnExitDo,
  OnExitStopSetting,
  SETTINGS_ID_EXIT_NODES,
  SETTINGS_ID_SELECTED_THEME,
  SETTINGS_ID_STOP_ON_EXIT
} from '../../types';
import { ThemeType } from '../features/uiStatusSlice';
import '../types/electronAPI';

export const getOnStopSetting = async (): Promise<OnExitStopSetting> => {
  return await window.electronAPI.config.get(
    SETTINGS_ID_STOP_ON_EXIT,
    getDefaultOnExitDo()
  ) as OnExitStopSetting;
};

export const setOnStopSetting = async (selectedSetting: OnExitStopSetting): Promise<void> => {
  await window.electronAPI.config.set(SETTINGS_ID_STOP_ON_EXIT, selectedSetting);
};

export const getThemeFromSettings = async (): Promise<ThemeType> => {
  return await window.electronAPI.config.get(SETTINGS_ID_SELECTED_THEME, 'light') as ThemeType;
};

export const setThemeToSettings = async (selectedTheme: ThemeType): Promise<void> => {
  await window.electronAPI.config.set(SETTINGS_ID_SELECTED_THEME, selectedTheme);
};

export const getSavedExitNodesFromSettings = async (): Promise<Array<string>> => {
  const nodes = await window.electronAPI.config.get(SETTINGS_ID_EXIT_NODES, [DEFAULT_EXIT_NODE]) as Array<string>;
  return nodes.map((m) => m.trim());
};

export const setSavedExitNodesToSettings = async (exitNodes: Array<string>): Promise<void> => {
  await window.electronAPI.config.set(
    SETTINGS_ID_EXIT_NODES,
    exitNodes.map((e) => e.trim())
  );
};
