import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import process from "node:process";

const require = createRequire(import.meta.url);

function getLibcVariant() {
  const glibcVersion = process.report?.getReport?.()?.header?.glibcVersionRuntime;
  return glibcVersion ? "gnu" : "musl";
}

function getPlatformPackageName(templates) {
  const { platform, arch } = process;
  const libcVariant = getLibcVariant();

  if (platform === "linux" && arch === "x64") {
    return templates.linuxX64?.[libcVariant] ?? null;
  }

  if (platform === "linux" && arch === "arm64") {
    return templates.linuxArm64?.[libcVariant] ?? null;
  }

  if (platform === "linux" && arch === "arm") {
    return templates.linuxArm ?? null;
  }

  if (platform === "win32" && arch === "x64") {
    return templates.win32X64 ?? null;
  }

  if (platform === "win32" && arch === "arm64") {
    return templates.win32Arm64 ?? null;
  }

  if (platform === "darwin" && arch === "x64") {
    return templates.darwinX64 ?? null;
  }

  if (platform === "darwin" && arch === "arm64") {
    return templates.darwinArm64 ?? null;
  }

  if (platform === "android" && arch === "arm64") {
    return templates.androidArm64 ?? null;
  }

  return null;
}

function hasPackage(packageName) {
  if (!packageName) return false;

  try {
    require.resolve(`${packageName}/package.json`);
    return true;
  } catch {
    return existsSync(`node_modules/${packageName}`);
  }
}

function getInstalledLightningcssVersion() {
  try {
    return require("../node_modules/lightningcss/package.json").version;
  } catch {
    return null;
  }
}

function getInstalledOxideVersion() {
  try {
    return require("../node_modules/@tailwindcss/oxide/package.json").version;
  } catch {
    return null;
  }
}

function installPackage(packageName, version) {
  const npmExecutable = process.platform === "win32" ? "npm.cmd" : "npm";
  const packageSpec = `${packageName}@${version}`;
  const result = spawnSync(
    npmExecutable,
    ["install", "--no-save", "--no-package-lock", "--ignore-scripts", packageSpec],
    {
      stdio: "inherit",
      cwd: process.cwd(),
      env: process.env,
    },
  );

  if (result.status !== 0) {
    throw new Error(`Failed to install ${packageSpec}`);
  }
}

function ensurePackage(label, version, packageName) {
  if (!version || !packageName) {
    return;
  }

  if (hasPackage(packageName)) {
    console.log(`[native] Using installed ${label} package: ${packageName}`);
    return;
  }

  console.log(`[native] Missing ${label} package for ${process.platform}/${process.arch}. Installing ${packageName}@${version}...`);
  installPackage(packageName, version);
}

ensurePackage(
  "lightningcss",
  getInstalledLightningcssVersion(),
  getPlatformPackageName({
    linuxX64: {
      gnu: "lightningcss-linux-x64-gnu",
      musl: "lightningcss-linux-x64-musl",
    },
    linuxArm64: {
      gnu: "lightningcss-linux-arm64-gnu",
      musl: "lightningcss-linux-arm64-musl",
    },
    linuxArm: "lightningcss-linux-arm-gnueabihf",
    win32X64: "lightningcss-win32-x64-msvc",
    win32Arm64: "lightningcss-win32-arm64-msvc",
    darwinX64: "lightningcss-darwin-x64",
    darwinArm64: "lightningcss-darwin-arm64",
    androidArm64: "lightningcss-android-arm64",
  }),
);

ensurePackage(
  "@tailwindcss/oxide",
  getInstalledOxideVersion(),
  getPlatformPackageName({
    linuxX64: {
      gnu: "@tailwindcss/oxide-linux-x64-gnu",
      musl: "@tailwindcss/oxide-linux-x64-musl",
    },
    linuxArm64: {
      gnu: "@tailwindcss/oxide-linux-arm64-gnu",
      musl: "@tailwindcss/oxide-linux-arm64-musl",
    },
    linuxArm: "@tailwindcss/oxide-linux-arm-gnueabihf",
    win32X64: "@tailwindcss/oxide-win32-x64-msvc",
    win32Arm64: "@tailwindcss/oxide-win32-arm64-msvc",
    darwinX64: "@tailwindcss/oxide-darwin-x64",
    darwinArm64: "@tailwindcss/oxide-darwin-arm64",
    androidArm64: "@tailwindcss/oxide-android-arm64",
  }),
);
