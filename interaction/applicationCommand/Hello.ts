import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v9";
import { HTTPResponse, reply } from "../../structures/HTTPResponse";
import { ApplicationGuildCommandContext } from "../../types/CommandContext";

export const command: RESTPostAPIApplicationCommandsJSONBody = {
  name: "HELLO",
  description: "Hello world.",
};

export const execute = async (
  ctx: ApplicationGuildCommandContext
): Promise<HTTPResponse> => {
  return reply({content: `Hello! ${ctx.requestor.user?.username}`});
  };

