// src/utils/versionChecker.ts
import { ref } from 'vue';

interface GitHubRelease {
    tag_name: string;
    html_url: string;
    name: string;
    body: string;
}

export function useVersionChecker(repoOwner: string, repoName: string) {
    const currentVersion = import.meta.env.VITE_APP_VERSION; // Set this in your .env
    const latestVersion = ref<string>('');
    const releaseUrl = ref<string>('');
    const isNewVersionAvailable = ref(false);
    const error = ref<Error | null>(null);
    const parseVersion = (version: string) => {
        return version.replace(/[^0-9.]/g, '').split('.').map(Number);
    };

    const compareVersions = (latest: string, current: string) => {
        // console.log(latest);
        // console.log(current);
        const latestParts = parseVersion(latest);
        const currentParts = parseVersion(current);

        for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
            const latestPart = latestParts[i] || 0;
            const currentPart = currentParts[i] || 0;
            if (latestPart > currentPart) return true;
            if (latestPart < currentPart) return false;
        }
        return false;
    };

    const checkLatestVersion = async () => {
        try {
            const response = await fetch(
                `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`
            );

            if (!response.ok) throw new Error('Failed to fetch releases');

            const data: GitHubRelease = await response.json();
            latestVersion.value = data.tag_name;
            releaseUrl.value = data.html_url;
            isNewVersionAvailable.value = compareVersions(data.tag_name.replace('v', ''), currentVersion);
        } catch (err) {
            error.value = err as Error;
            console.error('Version check failed:', err);
        }
    };
    const launchUpdater = () => {
        try {
            // For direct execution (if allowed by browser)
            window.location.href = `UpdaterMsarERP://update/${latestVersion.value}`;
            // Fallback if protocol handler not registered
            setTimeout(() => {
                if (!document.hidden) {
                    window.open(releaseUrl.value, '_blank');
                }
            }, 1000);
        } catch (error) {
            console.error('Failed to launch updater:', error);
            window.open(releaseUrl.value, '_blank');
        }
    };
    return {
        currentVersion,
        latestVersion,
        releaseUrl,
        isNewVersionAvailable,
        error,
        checkLatestVersion,
        launchUpdater
    };
}