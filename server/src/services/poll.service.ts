import { PollModel, PollStatus } from "../models/poll.model";
import { Types } from "mongoose";
import { schedulePollClose, clearPollSchedule } from "../lifecycle/poll.lifecycle";
import { clearPollKicks } from "../lifecycle/kick.lifecycle";

import mongoose from "mongoose";

import { isDbConnected } from "../config/db.config";

function ensureDb() {
  if (!isDbConnected()) {
    throw new Error("Database unavailable");
  }
}

class PollService {
  
  private translateError(err: any) {
    const msg = err?.message || "";
    if (
      msg.includes("buffering timed out") ||
      msg.includes("no primary") ||
      msg.includes("not connected") ||
      err.name === "MongooseServerSelectionError" ||
      err.name === "MongoNetworkError"
    ) {
      return new Error("Database unavailable");
    }
    return err;
  }

  async createPoll(question: string, options: string[], duration: number) {
    ensureDb();

    try {
      const existing = await PollModel.findOne({ status: PollStatus.ACTIVE });
      if (existing) throw new Error("Active poll already exists");

      const poll = await PollModel.create({
        question,
        options: options.map((text) => ({ text })),
        duration,
        startedAt: new Date(),
        status: PollStatus.ACTIVE,
      });

      schedulePollClose(duration, poll._id.toString(), async () => {
        const current = await PollModel.findById(poll._id);
        if (!current || current.status !== PollStatus.ACTIVE) return;
        current.status = PollStatus.CLOSED;
        await current.save();
      });

      return poll;
    } catch (e: any) {
      throw this.translateError(e);
    }
  }

  async getActivePoll() {
    ensureDb();

    try {
      const poll = await PollModel.findOne({ status: PollStatus.ACTIVE });
      if (!poll) return null;

      const elapsed = Math.floor(
        (Date.now() - new Date(poll.startedAt).getTime()) / 1000
      );

      if (elapsed >= poll.duration) {
        poll.status = PollStatus.CLOSED;
        await poll.save();
        return null;
      }

      return poll;
    } catch (e: any) {
      throw this.translateError(e);
    }
  }

  async submitVote(pollId: string, studentId: string, optionId: string) {
    ensureDb();

    try {
      const poll = await PollModel.findById(pollId);
      if (!poll) throw new Error("Poll not found");

      if (poll.status !== PollStatus.ACTIVE) throw new Error("Poll closed");

      const elapsed = Math.floor(
        (Date.now() - new Date(poll.startedAt).getTime()) / 1000
      );

      if (elapsed >= poll.duration) {
        poll.status = PollStatus.CLOSED;
        await poll.save();
        throw new Error("Time over");
      }

      const duplicate = poll.votes.some((v) => v.studentId === studentId);
      if (duplicate) throw new Error("Already voted");

      const valid = poll.options.some((o) => o._id.toString() === optionId);
      if (!valid) throw new Error("Invalid option");

      poll.votes.push({
        studentId,
        optionId: new Types.ObjectId(optionId),
        votedAt: new Date(),
      });

      await poll.save();
      return poll;
    } catch (e: any) {
      throw this.translateError(e);
    }
  }

  async closePoll(pollId: string) {
    ensureDb();

    try {
      const poll = await PollModel.findById(pollId);
      if (!poll) throw new Error("Poll not found");

      poll.status = PollStatus.CLOSED;
      await poll.save();
      clearPollSchedule();
      clearPollKicks(pollId);
      return poll;
    } catch (e: any) {
      throw this.translateError(e);
    }
  }

  async getPollHistory() {
    ensureDb();

    try {
      return PollModel.find({ status: PollStatus.CLOSED }).sort({ createdAt: -1 });
    } catch (e: any) {
      throw this.translateError(e);
    }
  }

  async buildPollPayload(poll: any, studentId?: string) {
    const totalVotes = poll.votes.length;

    const results = poll.options.map((option: any) => {
      const count = poll.votes.filter(
        (v: any) => v.optionId.toString() === option._id.toString()
      ).length;

      const percentage = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);

      return {
        optionId: option._id,
        text: option.text,
        count,
        percentage,
      };
    });

    let myVoteOptionId = null;

    if (studentId) {
      const vote = poll.votes.find((v: any) => v.studentId === studentId);
      if (vote) myVoteOptionId = vote.optionId;
    }

    return {
      pollId: poll._id,
      question: poll.question,
      duration: poll.duration,
      startedAt: poll.startedAt,
      results,
      totalVotes,
      myVoteOptionId,
    };
  }
}

export const pollService = new PollService();