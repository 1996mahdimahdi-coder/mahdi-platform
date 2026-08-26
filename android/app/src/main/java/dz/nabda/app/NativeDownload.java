package dz.nabda.app;

import android.app.DownloadManager;
import android.content.Context;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NativeDownload")
public class NativeDownload extends Plugin {

    @PluginMethod
    public void download(PluginCall call) {
        String url = call.getString("url");
        String filename = call.getString("filename");

        if (url == null || url.isEmpty()) {
            call.reject("URL is required");
            return;
        }
        if (filename == null || filename.isEmpty()) {
            call.reject("Filename is required");
            return;
        }

        Context context = getContext();
        DownloadManager dm = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);

        if (dm == null) {
            call.reject("DownloadManager not available");
            return;
        }

        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
        request.setTitle("NABDA");
        request.setDescription("Downloading " + filename);
        request.setNotificationVisibility(
            DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED
        );
        request.setDestinationInExternalPublicDir(
            Environment.DIRECTORY_DOWNLOADS,
            filename
        );
        request.setAllowedOverMetered(true);
        request.setAllowedOverRoaming(true);
        request.addRequestHeader("Accept", "application/vnd.android.package-archive");

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            request.setRequiresCharging(false);
        }

        try {
            long downloadId = dm.enqueue(request);
            JSObject result = new JSObject();
            result.put("id", downloadId);
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Download failed: " + e.getMessage(), e);
        }
    }
}
