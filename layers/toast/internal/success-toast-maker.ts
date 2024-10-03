export function defineSuccessToastMaker<RM extends RawActionToastMaker>(
  rawMaker: RM,
) {
  assert.ok(isFunction(rawMaker), "Action toast 'success' must be a function");
  return function (
    this: ActionToastsContext,
    ...args: Parameters<RM>
  ) {
    const notification = rawMaker.apply(this, args);
    return notification;
  };
};

export const successToastMaker = {
  define: defineSuccessToastMaker,
};
