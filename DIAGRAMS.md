# Diagram Components

This document explains how to use the inline React Flow diagram components in
MDX documentation files.

## Overview

The diagram system provides two types of diagrams:

1. **Flow Diagrams** - For architecture diagrams, data flows, and network
   topologies
2. **Sequence Diagrams** - For showing message flows between actors over time

## Flow Diagrams

Flow diagrams are the default type and are ideal for showing system
architecture, network configurations, and data flows.

### Basic Usage

```tsx
<Diagram height="h-48">
  <DiagramNode id="client">Client</DiagramNode>
  <DiagramNode id="gateway">API Gateway</DiagramNode>
  <DiagramNode id="backend">Backend</DiagramNode>
  <DiagramEdge from="client" to="gateway" />
  <DiagramEdge from="gateway" to="backend" />
</Diagram>
```

### Components

#### `<Diagram>`

The container component for all diagrams.

| Prop           | Type                           | Default        | Description                             |
| -------------- | ------------------------------ | -------------- | --------------------------------------- |
| `height`       | string                         | `"h-64"`       | Tailwind height class for the container |
| `direction`    | `"horizontal"` \| `"vertical"` | `"horizontal"` | Layout direction for nodes              |
| `showControls` | boolean                        | `false`        | Show zoom/pan controls                  |
| `type`         | `"flow"` \| `"sequence"`       | `"flow"`       | Diagram type                            |

#### `<DiagramNode>`

A node in the diagram.

| Prop       | Type        | Required | Description                    |
| ---------- | ----------- | -------- | ------------------------------ |
| `id`       | string      | Yes      | Unique identifier for the node |
| `children` | ReactNode   | Yes      | Label text for the node        |
| `variant`  | NodeVariant | No       | Color variant (see below)      |

#### `<DiagramEdge>`

An edge (connection) between nodes.

| Prop        | Type                                           | Default   | Description                         |
| ----------- | ---------------------------------------------- | --------- | ----------------------------------- |
| `from`      | string                                         | Required  | Source node ID                      |
| `to`        | string                                         | Required  | Target node ID                      |
| `label`     | string                                         | -         | Optional label on the edge          |
| `type`      | `"straight"` \| `"step"` \| `"smoothstep"`     | `default` | Edge line style (bezier by default) |
| `fromArrow` | boolean                                        | `false`   | Show arrow at source                |
| `toArrow`   | boolean                                        | `true`    | Show arrow at target                |
| `variant`   | EdgeVariant                                    | `default` | Color variant                       |
| `fromSide`  | `"left"` \| `"right"` \| `"top"` \| `"bottom"` | -         | Explicit source connection side     |
| `toSide`    | `"left"` \| `"right"` \| `"top"` \| `"bottom"` | -         | Explicit target connection side     |

#### `<DiagramGroup>`

A container for grouping related nodes (e.g., VPCs, regions).

| Prop       | Type      | Required | Description                     |
| ---------- | --------- | -------- | ------------------------------- |
| `id`       | string    | Yes      | Unique identifier for the group |
| `label`    | string    | Yes      | Label displayed above the group |
| `children` | ReactNode | Yes      | Nested `<DiagramNode>` elements |

### Variants

Both nodes and edges support color variants:

- `default` - Gray
- `blue` - Blue
- `green` - Green
- `orange` - Orange
- `red` - Red
- `yellow` - Yellow
- `zuplo` - Zuplo pink (#ff00bd)

### Examples

#### Simple Flow

```tsx
<Diagram height="h-48">
  <DiagramNode id="a">Step 1</DiagramNode>
  <DiagramNode id="b">Step 2</DiagramNode>
  <DiagramNode id="c">Step 3</DiagramNode>
  <DiagramEdge from="a" to="b" />
  <DiagramEdge from="b" to="c" />
</Diagram>
```

#### With Groups (VPC Example)

```tsx
<Diagram height="h-64">
  <DiagramNode id="client">Client</DiagramNode>
  <DiagramGroup id="dedicated-vpc" label="Dedicated VPC">
    <DiagramNode id="gateway" variant="zuplo">
      Zuplo API Gateway
    </DiagramNode>
  </DiagramGroup>
  <DiagramGroup id="customer-vpc" label="Customer VPC">
    <DiagramNode id="backend">Backend</DiagramNode>
  </DiagramGroup>
  <DiagramEdge from="client" to="gateway" />
  <DiagramEdge from="gateway" to="backend" />
</Diagram>
```

#### Explicit Edge Directions

When the automatic edge routing doesn't produce the desired result, use
`fromSide` and `toSide` to explicitly specify connection points:

```tsx
<Diagram height="h-64">
  <DiagramNode id="client">Client</DiagramNode>
  <DiagramGroup id="customer-vpc" label="Customer VPC">
    <DiagramNode id="waf">WAF</DiagramNode>
    <DiagramNode id="backend">Backend</DiagramNode>
  </DiagramGroup>
  <DiagramGroup id="dedicated-vpc" label="Dedicated VPC">
    <DiagramNode id="gateway" variant="zuplo">
      Zuplo API Gateway
    </DiagramNode>
  </DiagramGroup>
  <DiagramEdge from="client" to="waf" />
  <DiagramEdge from="waf" to="gateway" />
  <DiagramEdge from="gateway" to="backend" fromSide="left" toSide="right" />
</Diagram>
```

#### With Edge Labels

```tsx
<Diagram height="h-56">
  <DiagramNode id="source">Source Control</DiagramNode>
  <DiagramNode id="control" variant="zuplo">
    Control Plane
  </DiagramNode>
  <DiagramNode id="gateway" variant="zuplo">
    API Gateway
  </DiagramNode>
  <DiagramEdge from="source" to="control" label="Deploy" />
  <DiagramEdge from="control" to="gateway" />
</Diagram>
```

#### Vertical Layout

```tsx
<Diagram height="h-64" direction="vertical">
  <DiagramNode id="request">Request</DiagramNode>
  <DiagramNode id="auth">Authentication</DiagramNode>
  <DiagramNode id="rate">Rate Limiting</DiagramNode>
  <DiagramNode id="backend">Backend</DiagramNode>
  <DiagramEdge from="request" to="auth" />
  <DiagramEdge from="auth" to="rate" />
  <DiagramEdge from="rate" to="backend" />
</Diagram>
```

## Sequence Diagrams

Sequence diagrams show message flows between actors over time.

### Components

#### `<DiagramActor>`

An actor (participant) in the sequence.

| Prop       | Type        | Required | Description                     |
| ---------- | ----------- | -------- | ------------------------------- |
| `id`       | string      | Yes      | Unique identifier for the actor |
| `children` | ReactNode   | Yes      | Actor name/label                |
| `variant`  | NodeVariant | No       | Color for the actor's lifeline  |

#### `<DiagramMessage>`

A message between two actors.

| Prop       | Type      | Required | Description           |
| ---------- | --------- | -------- | --------------------- |
| `from`     | string    | Yes      | Source actor ID       |
| `to`       | string    | Yes      | Target actor ID       |
| `children` | ReactNode | Yes      | Message label/content |

### Example

```tsx
<Diagram type="sequence" height="h-80">
  <DiagramActor id="client" variant="blue">
    Client
  </DiagramActor>
  <DiagramActor id="gateway" variant="zuplo">
    API Gateway
  </DiagramActor>
  <DiagramActor id="backend" variant="green">
    Backend
  </DiagramActor>
  <DiagramMessage from="client" to="gateway">
    API Request
  </DiagramMessage>
  <DiagramMessage from="gateway" to="backend">
    Forward Request
  </DiagramMessage>
  <DiagramMessage from="backend" to="gateway">
    Response
  </DiagramMessage>
  <DiagramMessage from="gateway" to="client">
    API Response
  </DiagramMessage>
</Diagram>
```

## Tips

### Height Selection

Choose an appropriate height based on diagram complexity:

- `h-48` - Simple diagrams with 2-3 nodes
- `h-56` - Medium diagrams with 3-4 nodes or simple groups
- `h-64` - Standard diagrams with groups
- `h-80` - Larger diagrams or sequence diagrams with many messages
- `h-96` - Complex diagrams

### When to Use Groups

Use `<DiagramGroup>` when:

- Showing VPCs, regions, or network boundaries
- Grouping logically related components
- Indicating ownership or scope

### Edge Direction Tips

- In horizontal layouts, edges default to connecting right→left
- In vertical layouts, edges default to connecting bottom→top
- Use `fromSide` and `toSide` for non-standard connections (e.g., loops back)

### Accessibility

- Ensure node labels are descriptive
- Use edge labels when the relationship isn't obvious
- Choose variants that provide sufficient contrast
