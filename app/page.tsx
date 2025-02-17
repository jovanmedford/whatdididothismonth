"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
// import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import MainBanner from "./main-banner";
import Header from "./header";

// Amplify.configure(outputs);

// const client = generateClient<Schema>();

export default function App() {
  return (
    <>
      <Header />
      <main>
        <MainBanner />
      </main>
    </>
  );
}
