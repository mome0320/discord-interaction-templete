import {
  APIInteractionResponseCallbackData,
  APIInteractionResponse,
  InteractionResponseType,
  RESTPostAPIInteractionFollowupJSONBody,
  APIInteraction,
  Routes,
  RouteBases,
} from "discord-api-types/v9";
import fetch from "node-fetch";

export interface HTTPResponse {
  HTTPStatus: number;
  data: unknown;
}

export const respond = (
  response: APIInteractionResponse,
  { statusCode = 200 } = {}
): HTTPResponse => {
  return { HTTPStatus: statusCode, data: response };
};
export const notFound = (): HTTPResponse => ({
  HTTPStatus: 404,
  data: { code: 404, message: "NOT FOUND" },
});

export const reply = (data: APIInteractionResponseCallbackData): HTTPResponse =>
  respond({ type: InteractionResponseType.ChannelMessageWithSource, data });

export const updateMessage = (
  data: APIInteractionResponseCallbackData
): HTTPResponse =>
  respond({ type: InteractionResponseType.UpdateMessage, data });

export const deferReply = (
  interaction: APIInteraction,
  delayFunc: () => Promise<RESTPostAPIInteractionFollowupJSONBody>
): HTTPResponse => {
  new Promise<void>(async (resolve) => {
    const result = await delayFunc();
    await fetch(
      RouteBases.api +
        Routes.webhook(interaction.application_id, interaction.token),
      {
        method: "POST",
        body: JSON.stringify(result),
        headers: { "Content-Type": "application/json" },
      }
    );
    resolve();
  });
  return respond({
    type: InteractionResponseType.DeferredChannelMessageWithSource,
  });
};
