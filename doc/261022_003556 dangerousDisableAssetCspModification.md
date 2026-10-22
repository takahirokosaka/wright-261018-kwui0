# `dangerousDisableAssetCspModification`

## Q

https://v2.tauri.app/reference/config/?utm_source=chatgpt.com#dangerousdisableassetcspmodification says

> At compile time, Tauri parses all the frontend assets and changes the Content-Security-Policy to only allow loading of your own scripts and styles by injecting nonce and hash sources. This stricts your CSP, which may introduce issues when using along with other flexing sources.

`style-src 'self' 'unsafe-inline';` alone doesn’t work. CodeMirror reads its css and then makes a `<style>` in `<head>`, thus simply allowing inline css isn’t enough. The problem is where CodeMirror gets its css. In general, a library can specify its resource URLs in any way (e.g., ‘h’ + ‘t’ + ‘t’ + ‘p’ + ‘s’ + ‘:’ …). How can Tauri generate a CSP to allow such resources to be loaded?

## A

Tauri scans your bundled frontend assets and adds hashes and nonces to the CSP. That protects resources it can identify statically, but it cannot infer arbitrary resource URLs that arbitrary constructs at runtime. Its documentation explicitly provides`dangerousDisableAssetCspModification` for cases where this automatic restriction conflicts with your application's resource loading.

## Conclusion

Use both `'unsafe-inline'` and `"dangerousDisableAssetCspModification": ["style-src"]`. CodeMirror, MathJax, and user-defined css need these. It’s impossible to calculate the hash of a user-defined css at the build time.