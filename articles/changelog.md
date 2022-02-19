---
title: Change Log
---

## 2021-11-19

### Runtime

- Route validate improvements
- Improved system error responses
- Added DataDog log transport

### Portal

- New project switcher
- Build feedback shows in real-time
- Added tooltips on sidebar

## 2021-11-12

### Runtime

- **Breaking Change**: `RequestContext` was renamed to `ZuploRequest`.
  Additionally, it now implements the standard `Request` object so that it has a
  familiar API.
- Support for environmental variables in both local development with `.env` and
  in deployed environments.
- Standard project now includes git hooks that run source formatting with
  prettier.

### Portal

- Added not file file error message
- Copy to clipboard on routes and setting
