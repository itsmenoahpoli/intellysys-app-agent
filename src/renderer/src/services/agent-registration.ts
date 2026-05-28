import { api } from "@renderer/utils/api";

export type AgentIdentity = {
  identifier: string;
  hostname: string;
  platform: string;
  arch: string;
  appVersion: string;
};

export async function getAgentIdentity(): Promise<AgentIdentity> {
  if (!window.api?.identity) {
    throw new Error("Agent identity API is not available");
  }
  return window.api.identity.get();
}

export async function registerAgent(params: {
  serverUrl: string;
  licenseCode: string;
  identity: AgentIdentity;
}) {
  const { serverUrl, licenseCode, identity } = params;
  return api.post<{ success: boolean; data: { identifier: string } }>(
    "/agents/register",
    {
      identifier: identity.identifier,
      licenseCode,
      name: identity.hostname,
      platform: identity.platform,
      arch: identity.arch,
      appVersion: identity.appVersion,
    },
    {
      customBaseUrl: serverUrl,
    },
  );
}

export async function heartbeatAgent(params: {
  serverUrl: string;
  identifier: string;
}) {
  const { serverUrl, identifier } = params;
  return api.post<{ success: boolean }>(
    "/agents/heartbeat",
    { identifier },
    {
      customBaseUrl: serverUrl,
    },
  );
}
