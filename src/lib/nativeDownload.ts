import { registerPlugin } from "@capacitor/core";

interface NativeDownloadPlugin {
  download(options: {
    url: string;
    filename: string;
  }): Promise<{ id: number }>;
}

const NativeDownload = registerPlugin<NativeDownloadPlugin>("NativeDownload");

export default NativeDownload;
