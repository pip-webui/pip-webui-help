# Development and Testing Guide <br/> Pip.WebUI Help Module

This document provides high-level instructions on how to build and test the library.

* [Environment Setup](#setup)
* [Installing](#install)
* [Building](#build)
* [Testing](#test)
* [Contributing](#contrib) 

## <a name="setup"></a> Environment Setup

TBD...

## <a name="install"></a> Installing

TBD...

## <a name="build"></a> Building

Projects environment deploy is occurred using npm and gulp.

First install or update your local project's **npm** tools:

```bash
# First install all the NPM tools:
npm install

# Or update
npm update
```

Then run the **npm** scripts (located in `package.json`):

```bash
# To clean '/build' and '/dist' directories
npm run clean

# To build distribution files in the '/dist' directory
npm run build

# To launch samples (build will open samples/index page in web browser)
npm run samples
```

For more details on how the build process works and additional commands (available for testing and
debugging) developers should read the [Build Instructions](docs/guides/BUILD.md).

## <a name="test"></a> Testing

TBD...

## <a name="contrib"></a> Contributing

Developers interested in contributing should read the following guidelines:

* [Issue Guidelines]()
* [Contributing Guidelines]()
* [Coding guidelines]()

> Please do **not** ask general questions in an issue. Issues are only to report bugs, request
  enhancements, or request new features. For general questions and discussions, use the
  [Pip Devs Forum](https://groups.google.com/forum/#!forum/pipdevs).

It is important to note that for each release, the [ChangeLog](../CHANGELOG.md) is a resource that will
itemize all:

- Bug Fixes
- New Features
- Breaking Changes