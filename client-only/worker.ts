const queryableFunctions = {
  getDifference(minuend: number, subtrahend: number) {
    reply("printStuff", minuend - subtrahend);
  },
  waitSomeTime() {
    setTimeout(() => {
      reply("doAlert", 3, "seconds");
    }, 3000);
  },
};

function isValidMethodName(
  name: unknown,
): name is keyof typeof queryableFunctions {
  return (
    typeof name === "string" ||
    name === "getDifference" ||
    name === "waitSomeTime"
  );
}

function replyToUser() {
  if (!queryMethodListenerName) {
    throw new TypeError("reply - not enough arguments");
  }
  postMessage({
    queryMethodListener: queryMethodListenerName,
    queryMethodArguments,
  });
}

function isEventHasValidInput(event: MessageEvent) {
  return (
    event.data instanceof Object &&
    Object.hasOwn(event.data, "queryMethod") &&
    Object.hasOwn(event.data, "queryMethodArguments")
  );
}

function isValidParams(event: MessageEvent) {
  return true;
}

function callMethod(event: MessageEvent) {
  if (!isEventHasValidInput(event)) {
    throw new Error("Invalid input for worker");
  }
  const name = event.data.queryMethod;
  if (!isValidMethodName(name)) {
    throw new Error("Invalid queryMethod");
  }
  if (!isValidParams(event)) {
    throw new Error("Invalid params");
  }
  const method = queryableFunctions[name];
  return method.apply(self, event.data.queryMethodArguments);
}

onmessage = (event) => {
  callMethod(event);
};
