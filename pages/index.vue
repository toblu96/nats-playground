<template>
  <div>
    <h1>Synadia connection test</h1>
    <p>Current route: {{ route.path }}</p>
    <a href="https://nuxt.com/docs/getting-started/routing" target="_blank"
      >Learn more about Nuxt Routing</a
    >

    <div>
      <UIcon class="w-10 h-10" name="i-skill-icons-gcp-light" />
      <UIcon class="w-10 h-10" name="i-skill-icons-azure-light" />
    </div>
    <div>
      <UIcon class="w-10 h-10" name="i-fluent-rocket-24-filled" />
      <UIcon class="w-10 h-10" name="i-fluent-branch-24-filled" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { StringCodec, connect, credsAuthenticator } from "nats.ws";
const route = useRoute();

if (process.client) {
  const sc = StringCodec();

  const creds = await fetch("./myuser.creds");
  if (!creds.ok) {
    console.log("unable to find ./myuser.creds - aborting");
  }
  const token = await creds.text();
  const auth = credsAuthenticator(sc.encode(token));
  const nc = await connect({
    servers: "wss://connect.ngs.global",
    authenticator: auth,
    // debug: true,
  });
  console.log(`connected to ${nc.getServer()}`);

  console.log(nc.info);
}
</script>
