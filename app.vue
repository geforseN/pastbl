<template>
  <div class="relative">
    <header class="navbar h-10 bg-base-300">
      <span class="navbar-start">
        <span class="rounded bg-secondary p-2 font-bold text-xl">pastbl</span>
      </span>
      <button class="bg-primary">ASD</button>
      <button class="btn btn-secondary">ASD</button>
    </header>
    <u-form-group label="asd" name="asd">
      <u-input placeholder="asd"></u-input>
    </u-form-group>
    <ol v-if="pastasStore.pastas.length !== 0">
      <v-pasta v-bind="pasta" v-for="pasta of pastasStore.pastas"> </v-pasta>
    </ol>
    <div>
      <label for="">CREATE PASTA</label>
      <!-- FIXME https://giphy.com/gifs/bug-development-pastbl-hd7gjWy8YYjNsYqxYs -->
      <!-- TODO use this instead (use it with portal)  -->
      <!-- <u-notification title="asd" :id="1" :description="'sad' "></u-notification>  -->
      <u-button
        @click="
           (event: PointerEvent) => {
              pastasStore.createPasta({ tags, text })
              .then(() => text = '')
              .catch((error) => pasta.onCreationError(error, event, toRef(notificationsRef), toast));
          }
        "
      >
        FINAL PASTA
      </u-button>
      <div>
        <u-input class="w-48" type="text" v-model="tag" />
        <u-button
          @click="
            () => {
              tags.push(tag);
              tag = '';
            }
          "
          >ADD TAG</u-button
        >
        <div v-if="tags.length === 0">NO TAGS WERE ADDED</div>
        <ul v-else>
          <li v-for="tag of tags">{{ tag }}</li>
        </ul>
      </div>
      <div>
        <label for="pasta-text">PASTA TEXT: {{ text }}</label>
        <u-input type="text" v-model="text" />
      </div>
    </div>
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, dolore eaque.
      Enim, in quibusdam quo obcaecati debitis, sequi harum delectus doloremque
      fugit cupiditate facilis quasi nemo laborum ipsa quae dolores.
    </div>
    <div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis
      quisquam, repellendus asperiores explicabo, modi quibusdam distinctio qui
      quaerat reiciendis temporibus, consequuntur omnis quod rerum repudiandae
      beatae inventore nemo facere fuga?
    </div>
    <div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis
      quisquam, repellendus asperiores explicabo, modi quibusdam distinctio qui
      quaerat reiciendis temporibus, consequuntur omnis quod rerum repudiandae
      beatae inventore nemo facere fuga?
    </div>
    <div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis
      quisquam, repellendus asperiores explicabo, modi quibusdam distinctio qui
      quaerat reiciendis temporibus, consequuntur omnis quod rerum repudiandae
      beatae inventore nemo facere fuga?
    </div>
    <div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis
      quisquam, repellendus asperiores explicabo, modi quibusdam distinctio qui
      quaerat reiciendis temporibus, consequuntur omnis quod rerum repudiandae
      beatae inventore nemo facere fuga?
    </div>
    <div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis
      quisquam, repellendus asperiores explicabo, modi quibusdam distinctio qui
      quaerat reiciendis temporibus, consequuntur omnis quod rerum repudiandae
      beatae inventore nemo facere fuga?
    </div>
    <div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis
      quisquam, repellendus asperiores explicabo, modi quibusdam distinctio qui
      quaerat reiciendis temporibus, consequuntur omnis quod rerum repudiandae
      beatae inventore nemo facere fuga?
    </div>
    <div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis
      quisquam, repellendus asperiores explicabo, modi quibusdam distinctio qui
      quaerat reiciendis temporibus, consequuntur omnis quod rerum repudiandae
      beatae inventore nemo facere fuga?
    </div>
    <div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis
      quisquam, repellendus asperiores explicabo, modi quibusdam distinctio qui
      quaerat reiciendis temporibus, consequuntur omnis quod rerum repudiandae
      beatae inventore nemo facere fuga?
    </div>
    <div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis
      quisquam, repellendus asperiores explicabo, modi quibusdam distinctio qui
      quaerat reiciendis temporibus, consequuntur omnis quod rerum repudiandae
      beatae inventore nemo facere fuga?
    </div>
    <div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis
      quisquam, repellendus asperiores explicabo, modi quibusdam distinctio qui
      quaerat reiciendis temporibus, consequuntur omnis quod rerum repudiandae
      beatae inventore nemo facere fuga?
    </div>
    <div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis
      quisquam, repellendus asperiores explicabo, modi quibusdam distinctio qui
      quaerat reiciendis temporibus, consequuntur omnis quod rerum repudiandae
      beatae inventore nemo facere fuga?
    </div>
    <div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis
      quisquam, repellendus asperiores explicabo, modi quibusdam distinctio qui
      quaerat reiciendis temporibus, consequuntur omnis quod rerum repudiandae
      beatae inventore nemo facere fuga?
    </div>
    <div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis
      quisquam, repellendus asperiores explicabo, modi quibusdam distinctio qui
      quaerat reiciendis temporibus, consequuntur omnis quod rerum repudiandae
      beatae inventore nemo facere fuga?
    </div>
    <div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis
      quisquam, repellendus asperiores explicabo, modi quibusdam distinctio qui
      quaerat reiciendis temporibus, consequuntur omnis quod rerum repudiandae
      beatae inventore nemo facere fuga?
    </div>
    <u-notifications ref="notificationsRef" />
  </div>
</template>

<script lang="tsx" setup>
import { usePastasStore } from "./store/pastas.store";

const pastasStore = usePastasStore();

const { tag, tags, text, ...pasta } = usePasta();
const toast = useToast();
const notificationsRef = ref();
</script>
