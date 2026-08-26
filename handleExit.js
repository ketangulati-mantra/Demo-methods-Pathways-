export function handleExit() {
  if (typeof window === "undefined") return;

  // 1. React Native WebView
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        action: "navigate",
        screen: "Tasks",
        params: { page: "/tasks" }
      })
    );
    return;
  }

  // 2. iframe inside provider.mantracare.com
  if (window.parent !== window) {
    window.parent.postMessage(
      {
        action: "navigate",
        page: "/tasks",
        params: { page: "/tasks" }
      },
      "https://provider.mantracare.com"
    );
    return;
  }

  // 3. Standalone browser:
  // On localhost / dev environments, route back to local pathways dashboard
  const isLocalhost = 
    window.location.hostname === "localhost" || 
    window.location.hostname === "127.0.0.1";

  if (isLocalhost) {
    window.location.href = `${window.location.origin}/#/admin/pathways`;
  } else {
    // On production standalone browser
    window.location.href = "https://provider.mantracare.com/tasks";
  }
}