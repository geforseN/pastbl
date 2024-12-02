import type { ChatPastaProps } from "../../chat-pasta.ts";

const date = new Date("2022-01-01T00:00:00.000Z");

export const creationTime = {
  label: "Created",
  value: date,
};

export const someChatter = {
  badges: 1,
  nickname: "geforsen",
  nicknameColor: "red",
};

const text = "hello world";
const textPropValues = [
  text,
  text.repeat(10),
  text.repeat(40),
];

const compactPropValues = [true, false];

const tagsPropValues = [
  undefined,
  [],
  ["foo", "bar", "baz"],
  ["@geforsen"],
  ["@geforsen", ...Array.from({ length: 10 }, (_, i) => `foo${i}`)],
  [...Array.from({ length: 11 }, (_, i) => `bar${i}`), "@geforsen"],
] satisfies ChatPastaProps["tags"][];

export const propsToTest = compactPropValues.flatMap((compact) =>
  tagsPropValues.flatMap((tags) =>
    textPropValues.map((text) => {
      return {
        tags,
        compact,
        text,
      };
    }),
  ),
);
