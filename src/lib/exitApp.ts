type AnyRecord = Record<string, unknown>;

function getCapacitorAppPlugin(): AnyRecord | undefined {
  const cap = (window as unknown as AnyRecord | undefined)?.Capacitor as AnyRecord | undefined;
  const plugins = cap?.Plugins as AnyRecord | undefined;
  const app = plugins?.App as AnyRecord | undefined;
  return app;
}

export function canExitApp(): boolean {
  const w = window as any;
  const n = navigator as any;

  return (
    (typeof w?.AndroidInterface?.finishAffinity === "function") ||
    (typeof w?.AndroidInterface?.exitApp === "function") ||
    (typeof w?.Android?.exitApp === "function") ||
    (typeof n?.app?.exitApp === "function") ||
    (typeof getCapacitorAppPlugin()?.exitApp === "function")
  );
}

export function exitApp(): boolean {
  const w = window as any;
  const n = navigator as any;

  try {
    if (typeof w?.AndroidInterface?.finishAffinity === "function") {
      w.AndroidInterface.finishAffinity();
      return true;
    }
  } catch {
    // ignore
  }

  try {
    if (typeof w?.AndroidInterface?.exitApp === "function") {
      w.AndroidInterface.exitApp();
      return true;
    }
  } catch {
    // ignore
  }

  try {
    if (typeof w?.Android?.exitApp === "function") {
      w.Android.exitApp();
      return true;
    }
  } catch {
    // ignore
  }

  try {
    if (typeof n?.app?.exitApp === "function") {
      n.app.exitApp();
      return true;
    }
  } catch {
    // ignore
  }

  try {
    const app = getCapacitorAppPlugin();
    const exit = app?.exitApp;
    if (typeof exit === "function") {
      exit.call(app);
      return true;
    }
  } catch {
    // ignore
  }

  return false;
}

export function tutupAplikasi(): void {
  const w = window as any;
  if (typeof w?.AndroidInterface?.finishAffinity === "function") {
    w.AndroidInterface.finishAffinity();
  } else if (typeof w?.AndroidInterface?.exitApp === "function") {
    w.AndroidInterface.exitApp();
  } else {
    alert("Aplikasi tidak dapat ditutup secara otomatis dari browser");
  }
}

if (typeof window !== "undefined") {
  (window as any).tutupAplikasi = tutupAplikasi;
}
