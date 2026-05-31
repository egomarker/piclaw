export {
  abortLiveSshCommand,
  applyLiveSshConfig,
  clearLiveSshConfig,
  createChatSshCoreExtension,
  createSshAwareBashOperations,
  createSshCoreExtension,
  hasLiveChatSshSession,
  parseSshFlag,
  parseSshPort,
  parseStrictHostKeyCheckingMode,
  pullRemoteFileForChat,
  registerLiveChatSshSession,
  resolveRemoteTarget,
  resolveSshCoreConfigFromChatConfig,
  setSshConnectionResolverForTests,
  unregisterLiveChatSshSession,
  type SshCoreResolvedConfig,
  type SshStrictHostKeyCheckingMode,
} from "../../../src/extensions/ssh-core.js";

import sshCoreExtension from "../../../src/extensions/ssh-core.js";

export default sshCoreExtension;
