import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.121b9489a8f543e39f56a18eaf1bf3c4',
  appName: 'oil-barons-play',
  webDir: 'dist',
  server: {
    url: 'https://121b9489-a8f5-43e3-9f56-a18eaf1bf3c4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;