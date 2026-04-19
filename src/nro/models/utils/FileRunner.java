package nro.models.utils;

import java.io.IOException;

/**
 *
 * @author By Mr Blue
 * 
 */

public class FileRunner {

    public static void runScript(String scriptPath) throws IOException {
        ProcessBuilder processBuilder;
        if (System.getProperty("os.name").toLowerCase().contains("win")) {
            processBuilder = new ProcessBuilder("cmd", "/c", "start", scriptPath);
        } else {
            processBuilder = new ProcessBuilder("sh", scriptPath);
        }
        processBuilder.start();
    }

    public static void runBatchFile(String batchFilePath) throws IOException {
        runScript(batchFilePath);
    }
    
}
