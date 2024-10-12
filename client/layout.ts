import { html } from "hono/html";

export const layout = (children: any) =>
  html`<html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>gRPC Application</title>
      <style>
        h2,
        p,
        ul {
          margin: 0;
        }
      </style>
    </head>
    <body>
      ${children}
    </body>
  </html> `;
