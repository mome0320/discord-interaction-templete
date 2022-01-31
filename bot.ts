import { applicationCommands, buttonComponents } from "./interaction";
import {
  InteractionType,
  InteractionResponseType,
  APIMessageComponentInteractionData,
  APIMessageComponentInteraction,
  APIInteraction,
  APIApplicationCommandInteraction,
  APIGuildMember,
  APIApplicationCommandGuildInteraction,
  APIInteractionGuildMember,
  APIChatInputApplicationCommandInteractionData,
} from "discord-api-types/v9";
import { HTTPResponse, notFound, respond } from "./structures/HTTPResponse";
import type { Request } from "express";

export async function handleRequest(request: Request): Promise<HTTPResponse> {
  const interaction: APIInteraction = await request.body;
  switch (interaction.type) {
    case InteractionType.Ping:
      return respond({
        type: InteractionResponseType.Pong,
      });
    case InteractionType.MessageComponent:
      return onMessageComponent(interaction as APIMessageComponentInteraction);
    case InteractionType.ApplicationCommand:
      return onApplicationCommand(
        interaction as APIApplicationCommandInteraction
      );
    default:
      return notFound();
  }
}

async function onMessageComponent(interaction: APIMessageComponentInteraction) {
  const messageComponentData =
    interaction.data as APIMessageComponentInteractionData;
  const customID = messageComponentData.custom_id;
  const message = interaction.message;
  const member = message.member as APIGuildMember;
  const [cmdName, ...args] = customID.split("|");
  const buttonHandlers = Object.values(buttonComponents);
  const handler = buttonHandlers.find((cmd) => cmd.name === cmdName);
  if (!handler) return notFound();
  const callback = await handler.execute({
    cmdName,
    args,
    message,
    requestor: member,
    interaction,
  });
  return callback;
}

async function onApplicationCommand(
  interaction: APIApplicationCommandInteraction
) {
  if (!("member" in interaction)) return notFound();
  const guildInteraction = interaction as APIApplicationCommandGuildInteraction;
  const applicationCommandData =
    interaction.data as APIChatInputApplicationCommandInteractionData;
  const cmdName = applicationCommandData.name;
  const options = applicationCommandData.options;
  const requestor = interaction.member as APIInteractionGuildMember;
  const guildId = interaction.guild_id as string;
  const channelId = interaction.channel_id;
  const commandHandlers = Object.values(applicationCommands);
  const handler = commandHandlers.find((d) => d.command.name == cmdName);
  if (!handler) return notFound();
  const callback = handler.execute({
    cmdName,
    options,
    requestor,
    guildId,
    channelId,
    interaction: guildInteraction,
  });
  return callback;
}
