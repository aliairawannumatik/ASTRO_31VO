import ReactGA from 'react-ga4';
import { Capacitor } from '@capacitor/core';

export const initGA = () => {
  ReactGA.initialize('GA_MEASUREMENT_ID');
  const platform = Capacitor.isNativePlatform() ? 'android_app' : 'web';
  ReactGA.set({ platform });
};

export const trackPageView = (path: string) => {
  const platform = Capacitor.isNativePlatform() ? 'android_app' : 'web';
  ReactGA.send({ hitType: 'pageview', page: path, platform });
};
