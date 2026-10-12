export type File = {
  name: string;
  mimeType: string;
  dataUrl?: string;
  url?: string;
};

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage(message: string): void;
    };
  }
}

export function download(file: File) {
  if (typeof window === "undefined") return;

  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        action: "download",
        file,
      }),
    );
    return;
  }

  const href = file.dataUrl || file.url;
  if (!href) return;

  const link = document.createElement("a");
  link.download = file.name;
  link.href = href;
  link.click();
}

export async function share(data: { url?: string; message?: string; title?: string; file?: File }) {
  const { url, message, title, file } = data;
  if (typeof window === "undefined") return;

  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        action: "share",
        url,
        message,
        title,
        file,
      }),
    );
    return;
  }

  const text = [message, url].filter(Boolean).join("\n \n");

  if (file?.dataUrl) {
    const blob = await (await fetch(file.dataUrl)).blob();
    const browserFile = new File([blob], file.name, { type: file.mimeType });
    if (navigator.canShare?.({ files: [browserFile] })) {
      await navigator.share({ files: [browserFile], text, title });
      return;
    }
  } else if (navigator.share && (text || url)) {
    await navigator.share({ text, url, title });
    return;
  }

  const href = file?.dataUrl || file?.url;
  if (!href) return;

  const link = document.createElement("a");
  link.download = file?.name || "download";
  link.href = href;
  link.click();
}
