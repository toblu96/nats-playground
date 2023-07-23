<template>
  <PageWrapperWithHeaderSlim title="Dashboard">
    <template #header-content>
      <ClientOnly>
        <div class="flex space-x-6">
          <UTooltip text="Roundtrip Delay" class="flex items-center space-x-2">
            <UIcon name="i-fluent-timer-24-regular" class="w-6 h-6" />
            {{ roundTripTimeMS }} ms
          </UTooltip>
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
      <pre class="h-96 overflow-auto border rounded p-4 border-gray-200">{{
        messages
      }}</pre>
      <form
        @submit.prevent="publishMessage(message)"
        class="flex space-x-2 mt-4 w-full justify-end"
      >
        <UInput v-model="message" placeholder="Type a message..." />
        <UButton @click="publishMessage(message)">Send</UButton>
      </form>
    </div>
  </PageWrapperWithHeaderSlim>
</template>

<script setup lang="ts">
import {
  JSONCodec,
  NatsConnection,
  ServerInfo,
  StringCodec,
  connect,
  credsAuthenticator,
} from "nats.ws";
const route = useRoute();

const ncInfo = ref<ServerInfo | undefined>(undefined);
const roundTripTimeMS = ref<number>(0);

const message = ref<string>("");
const messages = ref<string>("");
let nc: NatsConnection;
const sc = StringCodec();
const jc = JSONCodec();

if (process.client) {
  const creds = await fetch("./myuser.creds");
  if (!creds.ok) {
    console.log("unable to find ./myuser.creds - aborting");
  }
  const token = await creds.text();
  const auth = credsAuthenticator(sc.encode(token));
  nc = await connect({
    servers: "wss://connect.ngs.global",
    authenticator: auth,
    // debug: true,
  });
  console.log(`connected to ${nc.getServer()}`);

  ncInfo.value = nc.info;
  roundTripTimeMS.value = await nc.rtt();

  nc.subscribe("chat", {
    callback(err, msg) {
      messages.value += `${jc.decode(msg.data).msg}\n`;
    },
  });

  nc.publish("chat", jc.encode({ msg: "Hi there! Type a message :)" }));
  console.log(nc.jetstream().consumers);
}

const publishMessage = (msg: string) => {
  nc.publish("chat", jc.encode({ msg }));
  message.value = "";
};
</script>
