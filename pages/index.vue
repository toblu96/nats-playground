<template>
  <PageWrapperWithHeaderSlim title="Dashboard">
    <template #header-content>
      <ClientOnly>
        <div class="flex space-x-6">
          <UTooltip text="Cient IP" class="flex items-center space-x-2">
            <UIcon name="i-fluent-laptop-24-regular" class="w-6 h-6" />
            {{ ncInfo?.client_ip }}
          </UTooltip>
          <UTooltip
            text="Connected nats server"
            class="flex items-center space-x-2"
          >
            <UIcon
              v-if="ncInfo?.server_name.startsWith('gcp')"
              class="w-6 h-6"
              name="i-skill-icons-gcp-light"
            />
            <UIcon
              v-else-if="ncInfo?.server_name.startsWith('azure')"
              class="w-6 h-6"
              name="i-skill-icons-azure-light"
            />
            <UIcon v-else class="w-6 h-6" name="i-skill-icons-aws-light" />
            <div>
              {{ ncInfo?.server_name }}
            </div>
          </UTooltip>
        </div>
      </ClientOnly>
    </template>
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
  </PageWrapperWithHeaderSlim>
</template>

<script setup lang="ts">
import { ServerInfo, StringCodec, connect, credsAuthenticator } from "nats.ws";
const route = useRoute();

const ncInfo = ref<ServerInfo | undefined>(undefined);

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
  ncInfo.value = nc.info;
}
</script>
