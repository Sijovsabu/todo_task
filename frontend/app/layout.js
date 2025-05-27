// frontend/app/layout.js
"use client";

import { ApolloProvider } from "@apollo/client";
import client from "../lib/apolloClient";

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <title>Task Management App</title>
      </head>
      <body>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </body>
    </html>
  );
}
