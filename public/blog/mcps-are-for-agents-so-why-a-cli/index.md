---
title: "MCPs Are for Agents. So Why Did I Turn Upwork's MCP Into a CLI?"
description: "MCP is built so agents can talk to software. But once enough functionality sits behind an MCP, a deterministic wrapper turns it into infrastructure conventional software can build on. I tested that idea with Upwork."
author: Waleed Ajmal
date: 2026-08-23
canonical: https://waleeds.world/blog/mcps-are-for-agents-so-why-a-cli/
cross_posted_to: Medium
---

# MCPs Are for Agents. So Why Did I Turn Upwork's MCP Into a CLI?

Upwork recently released an official MCP server. The obvious use case is connecting it to Claude or another agent and asking things like:

```
find good automation jobs for me
```

The agent can search Upwork, inspect jobs, look at client history, check your profile, read messages and interact with a surprisingly large part of the platform.

I wanted to see what happened if you went one layer lower. So I built a command-line interface around it.

## The problem with building directly around an agent

Agents are great when the task is ambiguous. *"Find the five jobs I have the best chance of winning"* requires reasoning.

But most software operations are not ambiguous. A dashboard does not need an LLM to decide how to retrieve five jobs every time somebody refreshes the page. It needs a predictable function.

That is the difference between:

```
Can you search Upwork for n8n jobs?
```

and:

```
upwork find_jobs search -p query=n8n -p limit=10 --org talent
```

> The second one is boring. And that is exactly why it is useful.

## Making MCP deterministic

The CLI maps Upwork MCP calls into a consistent structure:

```
upwork <tool> <action> <parameters>
```

It handles OAuth, account selection, parameters, structured output and Upwork's draft/confirmation flow for write operations. Underneath, it is still talking to the official MCP. The difference is that another program no longer has to reason about how to use it.

```
                 ┌→ AI Agent
Upwork → MCP → CLI → Backend/API → UI
                 └→ Automations
```

Use the agent where intelligence is valuable. Use deterministic calls where intelligence would just introduce variance.

## Why I think this matters

A lot of the conversation around MCP currently ends at: *"Now my AI can use this app."* But there is another interesting consequence.

If an MCP exposes enough of an application, you can build a deterministic abstraction around it and start using those capabilities inside traditional software — job-discovery dashboards, opportunity scoring, proposal research, client intelligence, freelancer analytics, scheduled workflows, internal tools, custom interfaces.

An AI agent can still analyze the information. It just doesn't have to be your API.

## MCP might become more than an agent interface

APIs were built primarily so software could talk to software. MCP is being built primarily so agents can talk to software.

But once enough useful functionality sits behind MCP servers, developers are inevitably going to build layers that make those capabilities usable in conventional applications too. That is what I wanted to test with the Upwork CLI.

The interesting part of the official Upwork MCP isn't simply that I can ask Claude to search for freelance jobs. It's that Upwork has exposed a substantial **programmable surface** to agents — and with a deterministic layer in front of it, that surface can start powering a lot more than agents.
