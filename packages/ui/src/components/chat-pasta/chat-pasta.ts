import { withBem } from "../../utils/bem" with { type: "macros" };
import type { ChatPastaChatterProps } from "./components/chat-pasta-chatter.ts";

export interface ChatPastaProps {
  text: string;
  time: {
    label: string;
    value: string | number | Date;
  };
  tags?: string[];
  compact?: boolean;
  chatter: ChatPastaChatterProps;
}

export const bem = withBem("chat-pasta");
