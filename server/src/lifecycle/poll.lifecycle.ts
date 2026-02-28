import { clearPollKicks } from "./kick.lifecycle";

let activePollTimeout: NodeJS.Timeout | null = null;


export const schedulePollClose = (
  duration: number,
  pollId: string,
  onExpire: () => Promise<void>
) => {
  if (activePollTimeout) {
    clearTimeout(activePollTimeout);
  }

  activePollTimeout = setTimeout(async () => {
    await onExpire();
    clearPollKicks(pollId);
    activePollTimeout = null;
  }, duration * 1000);
};

export const clearPollSchedule = () => {
  if (activePollTimeout) {
    clearTimeout(activePollTimeout);
    activePollTimeout = null;
  }
};