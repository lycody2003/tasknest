<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <form class="modal" @submit.prevent="submit">
      <div class="modal-head"><div><div class="eyebrow">TASK DETAILS</div><h2>{{ task ? 'Update task' : 'Create a task' }}</h2></div><button type="button" class="icon-btn" @click="$emit('close')">×</button></div>
      <label>Task name<input v-model.trim="form.title" required maxlength="180" placeholder="What needs to get done?" /></label>
      <label>Description<textarea v-model="form.description" rows="3" placeholder="Add a little context…"></textarea></label>
      <div class="form-grid">
        <label>Project<select v-model="form.project" required><option value="" disabled>Select project</option><option v-for="p in projects" :key="p._id" :value="p._id">{{ p.name }}</option></select></label>
        <label>Priority<select v-model="form.priority"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
        <label>Status<select v-model="form.status"><option value="todo">To do</option><option value="in-progress">In progress</option><option value="done">Done</option></select></label>
        <label>Due date<input v-model="form.dueDate" type="date" /></label>
      </div>
      <p v-if="error" class="form-error">{{ error }}</p>
      <div class="modal-actions"><button type="button" class="btn ghost" @click="$emit('close')">Cancel</button><button class="btn primary" :disabled="busy">{{ busy ? 'Saving…' : task ? 'Save changes' : 'Create task' }}</button></div>
    </form>
  </div>
</template>
<script setup>
import { reactive, ref, watch } from 'vue';
const props = defineProps({ task: Object, projects: { type: Array, default: () => [] } });
const emit = defineEmits(['close','save']);
const form = reactive({ title:'', description:'', project:'', priority:'medium', status:'todo', dueDate:'' });
const error = ref(''); const busy = ref(false);
watch(() => [props.task, props.projects], () => {
  const t = props.task;
  Object.assign(form, t ? { title:t.title, description:t.description || '', project:typeof t.project === 'object' ? t.project._id : t.project, priority:t.priority, status:t.status, dueDate:t.dueDate ? new Date(t.dueDate).toISOString().slice(0,10) : '' } : { title:'', description:'', project:props.projects[0]?._id || '', priority:'medium', status:'todo', dueDate:'' });
}, { immediate:true });
async function submit() { error.value=''; busy.value=true; try { await emit('save', { ...form, dueDate: form.dueDate || null }); } catch(e) { error.value=e.message || 'Could not save task'; } finally { busy.value=false; } }
</script>
