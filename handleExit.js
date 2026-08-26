export function handleExit() {
  if (typeof window === "undefined") return;

  // 1. React Native WebView
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        action: "exit",
      })
    );
    return;
  }

  // 2. iframe inside provider.mantracare.com
  if (window.parent !== window) {
    window.parent.postMessage(
      {
        action: "exit",
      },
      "https://provider.mantracare.com"
    );
    return;
  }

  // 3. Standalone browser
  window.location.href = "https://provider.mantracare.com/tasks";
}
