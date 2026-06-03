import { useEffect, useState } from 'react';
import { NativeModules, NativeEventEmitter, AppState, AppStateStatus } from 'react-native';

const { SkipServiceModule } = NativeModules;
const skipServiceEmitter = new NativeEventEmitter(SkipServiceModule);

export function useSkipService() {
  const [isServiceEnabled, setIsServiceEnabled] = useState<boolean>(false);
  const [isSkipEnabled, setIsSkipEnabled] = useState<boolean>(true);
  const [isMuteEnabled, setIsMuteEnabled] = useState<boolean>(false);
  const [skipCount, setSkipCount] = useState<number>(0);

  const checkStatus = async () => {
    if (!SkipServiceModule) return;
    
    const serviceEnabled = await SkipServiceModule.isServiceEnabled();
    setIsServiceEnabled(serviceEnabled);

    const skipEnabled = await SkipServiceModule.getSkipEnabled();
    setIsSkipEnabled(skipEnabled);

    const muteEnabled = await SkipServiceModule.getMuteEnabled();
    setIsMuteEnabled(muteEnabled);

    const count = await SkipServiceModule.getSkipCount();
    setSkipCount(count);
  };

  useEffect(() => {
    checkStatus();

    // Re-check status when app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkStatus();
      }
    });

    // Listen to skip events
    const eventSubscription = skipServiceEmitter.addListener('onAdSkipped', (event: { skipCount: number }) => {
      setSkipCount(event.skipCount);
    });

    return () => {
      subscription.remove();
      eventSubscription.remove();
    };
  }, []);

  const toggleSkip = () => {
    const newValue = !isSkipEnabled;
    SkipServiceModule.setSkipEnabled(newValue);
    setIsSkipEnabled(newValue);
    
    if (newValue) {
      SkipServiceModule.resetSkipCount();
      setSkipCount(0);
    }
  };

  const toggleMute = () => {
    const newValue = !isMuteEnabled;
    SkipServiceModule.setMuteEnabled(newValue);
    setIsMuteEnabled(newValue);
  };

  const openSettings = () => {
    SkipServiceModule.openAccessibilitySettings();
  };

  return {
    isServiceEnabled,
    isSkipEnabled,
    isMuteEnabled,
    skipCount,
    toggleSkip,
    toggleMute,
    openSettings,
    checkStatus,
  };
}
