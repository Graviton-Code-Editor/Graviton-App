import { Configuration } from "../configuration";
import { Framework } from "../Framework";
import { ElectronPlatformName, Packager } from "../index";
export declare type ElectronPlatformName = "darwin" | "linux" | "win32" | "mas";
export interface ElectronDownloadOptions {
    version?: string;
    /**
     * The [cache location](https://github.com/electron-userland/electron-download#cache-location).
     */
    cache?: string | null;
    /**
     * The mirror.
     */
    mirror?: string | null;
    /** @private */
    customDir?: string | null;
    /** @private */
    customFilename?: string | null;
    strictSSL?: boolean;
    isVerifyChecksum?: boolean;
    platform?: ElectronPlatformName;
    arch?: string;
}
export declare function createElectronFrameworkSupport(configuration: Configuration, packager: Packager): Promise<Framework>;
