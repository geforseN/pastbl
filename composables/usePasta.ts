type PastaTag = string;

export const usePasta = () => {
  const tag = ref<PastaTag>("");
  const tags = ref<Pasta["tags"]>([]);
  const text = ref<Pasta["text"]>("");

  return {
    tag,
    tags,
    text,
    $reset() {
      tag.value = "";
      tags.value = [];
      text.value = "";
    },
    removeTag: (tagToRemove: string) => {
      const tagIndex = tags.value.indexOf(tagToRemove);
      assert.ok(
        tagIndex >= 0,
        new ExtendedError("Can not remove the tag which is not in tags"),
      );
      tags.value.splice(tagIndex, 1);
    },
    removeAllTags: () => {
      tags.value = [];
    },
    addTag: (tagToAdd: PastaTag) => {
      assert.ok(
        tagToAdd.length !== 0,
        new ExtendedError("Can not add the empty tag", {
          title: "Pasta tag was not added",
        }),
      );
      assert.ok(
        !tags.value.includes(tagToAdd),
        new ExtendedError("The tag were already added to pasta", {
          title: "Pasta tag was not added",
        }),
      );
      tags.value.push(tagToAdd);
    },
  };
};
