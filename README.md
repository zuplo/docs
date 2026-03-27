# Zuplo Docs

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- Git LFS (Large File Storage)

## Getting Started

### Clone the Repository

This project uses Git LFS for managing large files (images, PDFs, etc.). Make
sure you have Git LFS installed before cloning:

```bash
# Install Git LFS (if not already installed)
# macOS: brew install git-lfs
# Ubuntu/Debian: apt-get install git-lfs
# Windows: Download from https://git-lfs.github.com/

# Initialize Git LFS
git lfs install

# Clone the repository
git clone https://github.com/zuplo/docs
cd docs

# Verify LFS files were downloaded
git lfs ls-files
```

### Installation

```bash
pnpm install
```

### Local Development

```
pnpm run dev
```

This command starts a local development server and opens up a browser window.
Most changes are reflected live without having to restart the server.

### Local Development (Zuplo Employees Only)

If you are a Zuplo employee, you can run the local development server to live
reload changes to zuplo policies. You must have the `core` repository cloned in
the same parent directory as this repository.

```
pnpm run dev:policies
```

### Build

```
pnpm run build
```

This command generates static content into the `build` directory and can be
served using any static contents hosting service.
