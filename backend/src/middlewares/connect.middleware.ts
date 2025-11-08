import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";

const interceptRequest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const clientId = req.headers["x-clientid"]
    console.log("client id" + clientId)

    clientId  && manageClientConnections(clientId as string, res)

    next()

  }
)

//key value strore to keep track of client connections
const connectedClients = new Map();

const manageClientConnections = async (clientId: string, res: Response) => {

  // Make sure unique clients are added and prevent overwritting

  if (!connectedClients.has(clientId)) {
    connectedClients.set(clientId, new Set());
  }

  //if existing connected client and the user has opened another tab or using another device add them to same group
  connectedClients.get(clientId).add(res);

  //client disconnect remove the response stream
  res.on("close", () => {
    // remove client from group
    connectedClients.get(clientId).delete(res);

    if (connectedClients.get(clientId).size === 0) {
      //free up memory, by deleting a client who has no open connections
      connectedClients.delete(clientId);
    }
  });

  const app = (await import("../app.js"));
  app.app.set("clients", connectedClients)
};

export default interceptRequest