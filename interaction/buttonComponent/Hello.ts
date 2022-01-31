import {
  HTTPResponse,
  updateMessage,
} from "../../structures/HTTPResponse";
import { ButtonCommandContext } from "../../types/CommandContext";

export const name = "HELLO";
export const execute = async (ctx: ButtonCommandContext): Promise<HTTPResponse> => {
  return updateMessage({
    content: `Hello! ${ctx.requestor.user?.username}`,
  });
};
