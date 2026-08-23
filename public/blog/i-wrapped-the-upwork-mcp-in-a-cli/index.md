---
title: "I Wrapped the Upwork MCP in a CLI. Here's Why."
description: "Upwork shipped an official MCP server. I wrapped it in a command-line interface so software — dashboards, automations, backends — can build on it deterministically. An agent should not have to be your API."
author: Waleed Ajmal
date: 2026-08-23
canonical: https://waleeds.world/blog/i-wrapped-the-upwork-mcp-in-a-cli/
cross_posted_to: DEV.to
---

# I Wrapped the Upwork MCP in a CLI. Here's Why.

The official Upwork MCP is much more interesting than *"Claude can now search Upwork."*

It exposes actual Upwork functionality to agents: jobs, profiles, proposals, messages, contracts, client data, competitor bid information — and even write actions.

But there was one problem.

**MCPs are designed for agents.** I wanted something deterministic enough to build software on top of.

So I built a CLI around the official Upwork MCP.

Instead of asking an agent:

```
find me good n8n jobs
```

I can run something predictable:

```
upwork find_jobs search -p query=n8n --org talent
```

Same command. Same parameters. Structured output.

**That distinction matters.**

## Why not just connect an agent to a frontend?

You technically can. But an agent is not a great API.

An LLM might choose a different tool, interpret the prompt differently, format its response differently, or make several unnecessary calls before getting the data you wanted.

That is useful when you want reasoning. It is annoying when your frontend just needs:

```
GET   jobs
GET   profile
GET   proposals
SEND  message
```

The CLI creates a deterministic layer between the MCP and everything else.

```
Upwork
   ↓
Official MCP
   ↓
CLI   ← deterministic layer
   ↓
API / Backend / Automations / Frontend
```

The agent can still sit on top when reasoning is useful. But it no longer needs to be in the middle of every operation.

## This opens up much more interesting stuff

Once the MCP has a predictable interface, it stops being only an AI-assistant integration. You can build:

- **Dashboards** — search jobs and visualize proposal counts, client spend, hiring history, bid ranges and other signals.
- **Automations** — run searches every hour, score opportunities, route interesting jobs and generate alerts.
- **Freelancer analytics** — pull your profile, rates, work history, Connects, proposals and transactions into your own tools.
- **Agentic workflows** — let an agent analyze 20 jobs while deterministic commands handle actually fetching the data.
- **Actual applications** — put a backend in front of the CLI and the official MCP can power normal interfaces instead of only living inside Claude.

## The CLI itself

It does its own OAuth 2.1 login (dynamic client registration + PKCE, tokens auto-refresh), then exposes **every** tool the server publishes through one generic dispatcher — nothing hardcoded, so it automatically covers any tool Upwork adds later.

```
cd upwork-cli
npm install
npm link          # optional: puts `upwork` on your PATH

upwork login      # authorize once — tokens persist & refresh
```

Every tool **and every action** is a first-class command, generated live from the server's schemas:

```
upwork commands                              # every tool + action, one screen
upwork find_jobs search -p query=n8n -p limit=5 --org talent
upwork get_profile get --org talent
upwork list_contracts search --org talent
upwork send_message send -p room_id=room_xxx -p text="Following up" --org talent
```

Write actions follow Upwork's own draft → confirm flow, and anything that binds money still finalizes on upwork.com by design.

> One wording note: I am deliberately not saying "you can't build an API out of an agent." You can. The sharper claim is that **an agent should not *have* to be your API.**

## Why this matters

MCP gives AI agents access to software. But once you put a deterministic layer around that access, the same infrastructure starts becoming useful for software itself.

The Upwork MCP is not just a new way to chat with Upwork. It is potentially a **new programmable interface into Upwork** — and that is the part I find most interesting.
