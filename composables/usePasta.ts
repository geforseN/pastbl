type PastaTag = string;

export const usePasta = () => {
  const tag = ref<PastaTag>("");
  const tags = ref<Pasta["tags"]>([]);
  const text = ref<Pasta["text"]>("");

  return {
    tag,
    tags,
    text,
    clear: () => {
      text.value = "";
      tags.value = [];
      tag.value = "";
    },
    removeTag: (tagValue: string) => {
      const tagIndex = tags.value.indexOf(tagValue);
      if (tagIndex === -1) {
        throw new ExtendedError("Can not remove the tag which is not in tags");
      }
      tags.value.splice(tagIndex, 1);
    },
    removeAllTags: () => {
      tags.value = [];
    },
    addTag: async (newTag: PastaTag) => {
      if (newTag.length === 0) {
        throw new ExtendedError("Can not add the empty tag", {
          title: "Pasta tag was not added",
        });
      }
      if (tags.value.includes(newTag)) {
        throw new ExtendedError("The tag were already added to pasta", {
          title: "Pasta tag was not added",
        });
      }
      tags.value.push(newTag);
    },
  };
};
