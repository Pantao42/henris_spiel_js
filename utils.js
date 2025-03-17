function clearScreenSync() {
    const isWindows = process.platform === 'win32';
    if (isWindows) {
        process.stdout.write('\x1Bc');
    } else {
        process.stdout.write('\x1B[2J\x1B[0f');
    }
}

module.exports = { clearScreenSync }; 