import { pollService } from "../services/poll.service";

export class PollController {
  async createPoll(data: { question: string; options: string[]; duration: number }) {
    return pollService.createPoll(data.question, data.options, data.duration);
  }

  async getActivePoll() {
    return pollService.getActivePoll();
  }

  async submitVote(data: { pollId: string; studentId: string; optionId: string }) {
    return pollService.submitVote(data.pollId, data.studentId, data.optionId);
  }

  async closePoll(pollId: string) {
    return pollService.closePoll(pollId);
  }

  async getPollHistory() {
    return pollService.getPollHistory();
  }
}

export const pollController = new PollController();