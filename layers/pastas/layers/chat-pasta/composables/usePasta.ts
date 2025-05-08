import { usePastaTags } from "./usePastaTags";

type UsePastaStateProperties = {
  tag?: Ref<string>;
  tags?: Ref<string[]>;
  text?: Ref<string>;
};

export const usePasta = (properties: UsePastaStateProperties = {}) => {
  const {
    tag = ref(""),
    tags = ref([] as string[]),
    text = ref(""),
  } = properties;

  const { addTag, removeTag, removeAllTags } = usePastaTags(tags);

  function reset() {
    tag.value = "";
    tags.value = [];
    text.value = "";
  }

  reset();

  return {
    tag,
    tags,
    text,
    reset,
    removeTag,
    removeAllTags,
    addTag,
    addOwnTag() {
      return this.addTag(toValue(tag));
    },
  };
};
