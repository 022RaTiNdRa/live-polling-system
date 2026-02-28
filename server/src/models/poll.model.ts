import mongoose, { Schema, Document, Types } from "mongoose";

export enum PollStatus {
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
}

export interface IOption {
  _id: Types.ObjectId;
  text: string;
}

export interface IVote {
  studentId: string;
  optionId: Types.ObjectId;
  votedAt: Date;
}

export interface IPoll extends Document {
  question: string;
  options: IOption[];
  votes: IVote[];
  duration: number;
  startedAt: Date;
  status: PollStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OptionSchema = new Schema<IOption>(
  {
    text: { type: String, required: true },
  },
  { _id: true }
);

const VoteSchema = new Schema<IVote>({
  studentId: { type: String, required: true },
  optionId: { type: Schema.Types.ObjectId, required: true },
  votedAt: { type: Date, default: Date.now },
});

const PollSchema = new Schema<IPoll>(
  {
    question: { type: String, required: true },

    options: {
      type: [OptionSchema],
      validate: [(val: IOption[]) => val.length >= 2, "Minimum 2 options"],
    },

    votes: {
      type: [VoteSchema],
      default: [],
    },

    duration: { type: Number, required: true },

    startedAt: { type: Date, required: true },

    status: {
      type: String,
      enum: Object.values(PollStatus),
      default: PollStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

export const PollModel = mongoose.model<IPoll>("Poll", PollSchema);