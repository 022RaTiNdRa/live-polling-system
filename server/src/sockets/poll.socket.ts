import { Server, Socket } from "socket.io";
import { pollController } from "../controllers/poll.controller";
import { schedulePollClose } from "../lifecycle/poll.lifecycle";
import { PollModel, PollStatus } from "../models/poll.model";
import { pollService } from "../services/poll.service";
import { isDbConnected } from "../config/db.config";
import { addKick, isKicked } from "../lifecycle/kick.lifecycle";
import {
  addStudent,
  getStudentCount,
  getSocket,
  removeStudentByStudent,
  removeStudentBySocket,
  getAllStudents,
} from "../lifecycle/presence.lifecycle";

export const registerPollSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);


    socket.emit("db_status", { connected: isDbConnected() });

    socket.emit("server_status", { dbConnected: isDbConnected() });

    socket.on("student_join", async (studentId: string) => {

      const active = await pollController.getActivePoll();
      if (active && isKicked(active._id.toString(), studentId)) {
        socket.emit("kicked", { pollId: active._id.toString() });
        return;
      }

      addStudent(studentId, socket.id);
      io.emit("presence_update", { count: getStudentCount(), students: getAllStudents() });
    });

    socket.on("student_leave", () => {
      removeStudentBySocket(socket.id);
      io.emit("presence_update", { count: getStudentCount(), students: getAllStudents() });
    });

    socket.on("get_active_poll", async (studentId: string, callback) => {
      try {
        if (!isDbConnected()) {
          return callback({ success: false, message: "Database not connected" });
        }

        const poll = await pollController.getActivePoll();
        if (!poll) return callback({ success: true, poll: null });

        
        if (isKicked(poll._id.toString(), studentId)) {
          socket.emit("kicked", { pollId: poll._id.toString() });
          return callback({ success: true, poll: null });
        }

        const payload = await pollService.buildPollPayload(poll, studentId);
        callback({ success: true, poll: payload });
      } catch (e: any) {
        callback({ success: false, message: e.message });
      }
    });

    socket.on("create_poll", async (data, callback) => {
      try {
        if (!isDbConnected()) {
          return callback({ success: false, message: "Database not connected" });
        }

        const poll = await pollController.createPoll(data);

        schedulePollClose(poll.duration, poll._id.toString(), async () => {
          const current = await PollModel.findById(poll._id);
          if (!current || current.status !== PollStatus.ACTIVE) return;

          current.status = PollStatus.CLOSED;
          await current.save();

          const payload = await pollService.buildPollPayload(current);
          io.emit("poll_closed", payload);
        });

        const payload = await pollService.buildPollPayload(poll);
        io.emit("poll_created", payload);

        callback({ success: true });
      } catch (e: any) {
        callback({ success: false, message: e.message });
      }
    });

    socket.on("submit_vote", async (data, callback) => {
      try {
        if (!isDbConnected()) {
          return callback({ success: false, message: "Database not connected" });
        }

        
        const active = await pollController.getActivePoll();
        if (active && data.studentId && isKicked(active._id.toString(), data.studentId)) {
          socket.emit("kicked", { pollId: active._id.toString() });
          return callback({ success: false, message: "Kicked from poll" });
        }

        const poll = await pollController.submitVote(data);
        const payload = await pollService.buildPollPayload(poll);
        io.emit("vote_updated", payload);
        callback({ success: true });
      } catch (e: any) {
        callback({ success: false, message: e.message });
      }
    });

    socket.on("get_poll_history", async () => {
      try {
        if (!isDbConnected()) {
          return socket.emit("poll_history", []);
        }

        const polls = await pollService.getPollHistory();

        const payload = await Promise.all(
          polls.map((p) => pollService.buildPollPayload(p))
        );

        socket.emit("poll_history", payload);
      } catch {
        socket.emit("poll_history", []);
      }
    });

    
    socket.on("join_poll", async (pollId: string, callback?: (res: any) => void) => {
      try {
        if (!isDbConnected()) {
          callback?.({ success: false, message: "Database not connected" });
          return;
        }

        const poll = await PollModel.findById(pollId);
        if (!poll) {
          callback?.({ success: false, message: "Poll not found" });
          return;
        }

        const room = `poll:${pollId}`;
        socket.join(room);
        callback?.({ success: true });
      } catch (e: any) {
        callback?.({ success: false, message: e.message });
      }
    });

    
    socket.on("chat_message", async (data: { pollId: string; studentId?: string; name?: string; text: string }, callback?: (res: any) => void) => {
      try {
        if (!isDbConnected()) {
          callback?.({ success: false, message: "Database not connected" });
          return;
        }

        const { pollId, studentId, name, text } = data;
        if (!pollId || !text || !text.trim()) {
          callback?.({ success: false, message: "Invalid payload" });
          return;
        }

        const poll = await PollModel.findById(pollId);
        if (!poll) {
          callback?.({ success: false, message: "Poll not found" });
          return;
        }

        
        if (poll.status !== PollStatus.ACTIVE) {
          callback?.({ success: false, message: "Poll closed" });
          return;
        }

        const room = `poll:${pollId}`;
        const payload = {
          pollId,
          studentId: studentId ?? null,
          name: name ?? "",
          text: text.trim(),
          ts: new Date().toISOString(),
        };

        io.to(room).emit("chat_message", payload);
        callback?.({ success: true });
      } catch (e: any) {
        callback?.({ success: false, message: e.message });
      }
    });

   
    socket.on("typing_start", async (data: { pollId: string; name: string }) => {
      try {
        if (!isDbConnected()) return;

        const { pollId, name } = data;
        if (!pollId || !name) return;

        const poll = await PollModel.findById(pollId);
        if (!poll) return;

     
        const room = `poll:${pollId}`;
        socket.to(room).emit("typing_start", { pollId, name });
      } catch (e: any) {
       
      }
    });

    
    socket.on("typing_stop", async (data: { pollId: string; name: string }) => {
      try {
        if (!isDbConnected()) return;

        const { pollId, name } = data;
        if (!pollId || !name) return;

        const poll = await PollModel.findById(pollId);
        if (!poll) return;

       
        const room = `poll:${pollId}`;
        socket.to(room).emit("typing_stop", { pollId, name });
      } catch (e: any) {
       
      }
    });

   
    socket.on("kick_student", async (data: { pollId: string; studentId: string }) => {
      try {
        const { pollId, studentId } = data;
        if (!pollId || !studentId) return;

        
        addKick(pollId, studentId);

        
        const sock = getSocket(studentId);
        if (sock) {
          io.to(sock).emit("kicked", { pollId });
        }

        
        removeStudentByStudent(studentId);
        io.emit("presence_update", { count: getStudentCount(), students: getAllStudents() });
      } catch {
        
      }
    });

    socket.on("disconnect", () => {
      removeStudentBySocket(socket.id);
      io.emit("presence_update", { count: getStudentCount(), students: getAllStudents() });
      console.log("User disconnected:", socket.id);
    });
  });
};