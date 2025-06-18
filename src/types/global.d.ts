// Global type definitions for platform SDKs

declare global {
  interface Window {
    google?: {
      apps?: {
        script?: {
          run?: any;
        };
      };
    };
    microsoft?: {
      teams?: any;
    };
    ZoomMtg?: any;
  }

  var google: {
    apps: {
      script: {
        run: any;
      };
    };
  } | undefined;

  var microsoft: {
    teams: any;
  } | undefined;

  var ZoomMtg: any | undefined;
}

export {}; 