## Installing

To start using the package execute:
```shell
tns install android-snapshot
```

This will install the [`nativescript-dev-android-snapshot`](https://www.npmjs.com/package/nativescript-dev-android-snapshot) package and save it as a dev dependency.

## Activating

The plugin's hooks will be activated by default **only in release** configuration.

Optionally, this behavior can also be controlled by the `TNS_ANDROID_SNAPSHOT` environment variable:
* Set it to `0` to temporarily disable snapshots in release configuration.
* Set it to `1` to enable snapshots in even debug configuration.

## Usage

When the `android-snapshot` plugin is activated, it will check whether the application is using Angular or not. Depending on that it will install either the `tns-core-modules-snapshot` package or the `nativescript-angular-snapshot` package (which includes the `tns-core-modules` + `@angular`). The specific version of this package will be determined by the original package version and the V8 version used in the currently installed Android Runtime.

> **Example:** If you have `tns-core-modules@2.0.1` and `tns-android@2.1` installed (which comes with V8 4.7.80), the `android-snapshot` plugin will search for and download the `tns-core-modules-snapshot@latest-2.0.1-4.7.80` package (if not already manually installed).

Each of these packages has the following structure:
```
<package_name>-snapshot
├── _embedded_script_.js
├── bundle.records.json
└── snapshots
    ├── arm64-v8a
    │   └── snapshot.blob
    ├── armeabi-v7a
    │   └── snapshot.blob
    └── x86
        └── snapshot.blob
```

The `_embedded_script_.js` contains all the contents of the original plugin (and its dependencies) bundled with [webpack](https://webpack.github.io/). This file is required for the [Android static binding generator](https://github.com/NativeScript/android-static-binding-generator/) tool. It is thus excluded from the final application package.

Each of the `snapshot.blob` files contains **this exact script** precompiled in binary form for the respective architecture. Modifications of the original package (and its dependencies) or of the `_embedded_script_.js` will have no effect because the new contents will mismatch that already included in the `snapshot.blob` files.

During [platform preparation](https://github.com/NativeScript/nativescript-cli/blob/master/docs/man_pages/project/configuration/prepare.md) the `android-snapshot` plugin will delete all JavaScript files that are in the snapshot package (specified in the `bundle.records.json` file) and will instrument the Android Runtime to load the correct `snapshot.blob` file during startup. This will allow all further `require(module)` calls to be resolved from the modules cache contained within the snapshot binary.

## Uninstalling

To remove the `android-snapshot` package execute:
```shell
npm uninstall nativescript-dev-android-snapshot --save-dev
```

This will also remove any `tns-core-modules-snapshot`/`nativescript-angular-snapshot` packages that may be installed and delete all leftover files from the platform's assets.

## Troubleshooting

After plugin removal or between configuration changes it is possible that the CLI will fail to prepare some plugins. This can be resolved by removing and then adding the `android` platform.

For more information or reporting issues follow this repository: https://github.com/NativeScript/android-snapshot
