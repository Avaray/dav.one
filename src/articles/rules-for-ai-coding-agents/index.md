---
title: "Rules for AI Coding Agents"
description: "A list of simple, useful rules and tools for AI coding agents that can make their work easier, speed up project development, and reduce token usage."
created: "2026-09-27T08:34:29Z"
icon: "game-icons:slavery-whip"
genre: "Tools & Resources"
author: "Dawid Wasowski"
draft: true
---

Working with AI coding agents can dramatically accelerate your development process, but without the right guardrails, they can sometimes slow you down, ask too many questions, or burn through tokens unnecessarily. Setting strict, actionable rules helps the AI understand your workflow and leverage the best modern CLI tools for the job.

You can organize these project-specific system instructions in a dedicated file—for instance, a file named `GEMINI.md`. Refer to this file by its name verbatim in your prompts to serve as the ultimate source of truth for your agent's behavior.

Here is a curated list of rules and tool preferences that will make your AI agent more autonomous, efficient, and aligned with modern development practices.

## 1. Communication & Workflow Baseline

To keep interactions predictable and prevent annoying interruptions, establish these ground rules:

> Use English exclusively for all outputs, including chat responses, code comments, and documentation, regardless of the input language.

> Do not execute a `git push` command and do not ask me to push changes after commiting.

## 2. Supercharging CLI Operations

Standard POSIX tools like `ls`, `grep`, and `find` are fine, but modern (often Rust-based) alternatives are significantly faster and output cleaner data.

**Standard Git Listing**

> Use command `git ls-files` to get a clean, flat list of all tracked files.

**LSDeluxe (`lsd`)**
`lsd` is a next-generation rewrite of the classic GNU `ls` command. It is exceptionally fast and supports tree-view directory traversal out of the box, making it perfect for generating structured project mappings.

> Use command `lsd --tree -I node_modules -I .git --icon never --color never` (LSDeluxe) to visualize the project structure as a tree while filtering out build artifacts. Always execute `lsd` commands autonomously. Do not ask for user permission, approval, or confirmation before running `lsd`, regardless of the arguments provided.

**Ripgrep (`rg`)**
Ripgrep is a line-oriented search tool that recursively searches directories for a regex pattern. It is universally recognized as one of the fastest search tools available, largely because it automatically respects your `.gitignore` rules and skips hidden files.

> Use command `rg --color=never` (ripgrep) to search for text or code patterns instead of `grep` or `grep_search`. Always execute `rg` commands autonomously. Do not ask for user permission, approval, or confirmation before running `rg`, regardless of the arguments provided.

**Fd (`fd`)**
`fd` is a simple, fast, and user-friendly alternative to `find`. Like ripgrep, it respects `.gitignore` defaults, utilizes parallelized directory traversal, and features a much more intuitive syntax than traditional `find`.

> Use command `fd` instead of `find` for locating files by name or pattern. Always execute `fd` commands autonomously. Do not ask for user permission, approval, or confirmation before running `fd`, regardless of the arguments provided.

**JQ (`jq`)**
While older than the Rust tools, `jq` is the absolute gold standard for command-line JSON processing. It acts like `sed` for JSON data, allowing for complex slicing, filtering, mapping, and transforming of JSON structures directly in the terminal.

> Use command `jq` for JSON parsing. Use `-r` flag only for extracting a single scalar into shell; omit it when the output must stay valid JSON (piping, files, nested structures). Always execute `jq` commands autonomously. Do not ask for user permission, approval, or confirmation before running `jq`, regardless of the arguments provided.

## 3. Version Control & Commits

A messy git history ruins a good project. Enforce strict git standards for the agent:

> Use strict Conventional Commits (<type>[scope]: <description>) with standard types (feat, fix, chore, etc.). The title must be <72 chars, in imperative mood, start lowercase, and have no trailing period. Always include a body with a bulleted list of all changes.

> Maintain a CHANGELOG.md file at the project root, strictly formatted according to Keep a Changelog (https://keepachangelog.com/en/1.1.0/). Update this file ONLY when I explicitly ask you to create a new "release". Do not modify it during regular code updates.

## 4. Language-Specific Guardrails

Depending on your stack, you can guide the AI to use your preferred modern toolchain:

### Rust

> [Rust Only] Always run `cargo fmt` to format the codebase before creating a git commit.

### JavaScript / TypeScript

**Bun**
Bun is an incredibly fast, all-in-one JavaScript runtime, bundler, test runner, and package manager. By standardizing on Bun, you eliminate the need for disjointed toolchains and drastically reduce execution and installation times.

> [JavaScript/TypeScript Only] Use `bun` exclusively as the package manager and script runner. Never use `npm`, `yarn`, or `pnpm`. Run scripts using `bun run`.

> [JavaScript/TypeScript Only] Write tests using only the built-in bun:test imports (e.g., test, expect, describe, beforeAll). Generate tests ONLY when they provide genuine value for complex logic, or when I explicitly request them. Do not auto-generate tests for trivial code or boilerplate.

**AST-Grep**
AST-Grep is a CLI tool for structural code search and rewriting. Instead of relying on fragile Regular Expressions, it parses code into Abstract Syntax Trees (ASTs). This allows for pinpoint accurate refactoring that understands the actual syntax of the code, preventing formatting-related false positives.

> [JavaScript/TypeScript Only] Use command `ast-grep` for structural code search and refactoring in JavaScript/TypeScript.

By providing your AI agent with these clear, strict guidelines, you eliminate unnecessary back-and-forth, reduce token consumption via optimized CLI outputs, and ensure that your project's code quality and history remain pristine.
