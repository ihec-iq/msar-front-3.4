<!-- src/components/VersionChecker.vue -->
<script setup lang="ts">
import { onMounted } from 'vue';
import { useVersionChecker } from '../utilities/versionChecker';
import { Icon } from '@iconify/vue';

const {
    currentVersion,
    latestVersion,
    releaseUrl,
    isNewVersionAvailable,
    error,
    checkLatestVersion,
    launchUpdater
} = useVersionChecker('ihec-iq', 'msar-erp');

onMounted(() => {
    checkLatestVersion();
});
 
</script>

<template>
    <div v-if="error" class="version-error flex">
        Error checking updates: {{ error.message }} 
        <Icon icon="mdi-refresh" @click="checkLatestVersion" class="cursor-pointer border-2 align-middle  text-gray-200" />
    </div>
    <div v-else-if="isNewVersionAvailable" class="update-banner">
        🎉 New version {{ latestVersion }} available!
        <!-- <a :href="releaseUrl" target="_blank">Update now</a> -->
        <a @click="launchUpdater" class="cursor-pointer">Update now</a>
    </div>
    <!-- <div v-else class="version-info">
        Current version: {{ currentVersion }}
    </div> -->
</template>

<style scoped>
.update-banner {
    padding: 10px;
    background: #ffd700;
    color: #000;
    text-align: center;
}

.version-info {
    padding: 10px;
    text-align: center;
    opacity: 0.8;
}

.version-error {
    padding: 10px;
    background: #ff4444;
    color: white;
    text-align: center;
}
</style>