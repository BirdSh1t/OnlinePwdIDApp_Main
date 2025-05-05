<template>
  <div v-if="fileUrl" class="document-preview">
    <template v-if="fileUrl.endsWith('.pdf')">
      <embed :src="fileUrl" type="application/pdf" width="100%" height="500px" />
    </template>
    <template v-else>
      <img :src="fileUrl" alt="Document" style="max-width: 100%; max-height: 300px" />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    file: [String, File],
    type: String
  },
  computed: {
    fileUrl() {
      if (!this.file) return '';
      if (typeof this.file === 'string') {
        return `/api/Documents/${this.type}/${this.file}`;
      }
      if (this.file instanceof File) {
        return URL.createObjectURL(this.file);
      }
      return '';
    }
  }
};
</script>

<style scoped>
.document-preview {
  margin-top: 10px;
  display: block;
}
</style>
