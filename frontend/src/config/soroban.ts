import { Server } from "soroban-client";
import { RPC_URL } from "../constants";

export const sorobanServer = new Server(RPC_URL, {
  allowHttp: false,
});
