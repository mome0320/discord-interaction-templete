import type {
  APIMessage,
  APIGuildMember,
  APIApplicationCommandInteractionDataOption,
  APIInteraction,
} from "discord-api-types/v9";

interface CommandContextBase {
  cmdName: string;
  interaction: APIInteraction;
  requestor: APIGuildMember;
}

export interface ButtonCommandContext extends CommandContextBase {
  args: string[];
  message: APIMessage;
}

export interface ApplicationGuildCommandContext extends CommandContextBase {
  options?: APIApplicationCommandInteractionDataOption[];
  guildId: string;
  channelId: string;
}
