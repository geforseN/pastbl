type PastaTag = string;

export default function usePasta() {
  const tag = ref<PastaTag>("");
  const tags = ref<Pasta["tags"]>([]);
  const text = ref<Pasta["text"]>("");

  async function addTagWithClear(newTag: PastaTag) {
    if (newTag.length === 0) {
      throw new ExtendedError("Can not add the empty tag");
    }
    if (tags.value.includes(newTag)) {
      throw new ExtendedError("The tag were already added to pasta");
    }
    tags.value.push(newTag);
    tag.value = "";
  }

  function removeTag(tagValue: string) {
    const tagIndex = tags.value.indexOf(tagValue);
    if (tagIndex === -1) {
      throw new ExtendedError("Can not remove the tag which is not in tags");
    }
    tags.value.splice(tagIndex, 1);
  }

  function clear() {
    text.value = "";
    tags.value = [];
    tag.value = "";
  }

  return {
    tag,
    tags,
    text,
    clear,
    removeTag,
    addTagWithClear,
  };
}
