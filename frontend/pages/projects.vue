<template>
    <NuxtLayout>
        <div class="page-heading">
            <div>
                <div class="eyebrow">YOUR BIG PICTURE</div>
                <h1>Projects<span class="heading-dot">.</span></h1>
                <p class="muted">Give your goals a home, then bring them to life.</p>
            </div><button class="btn primary" @click="showCreate = true">＋ New project</button>
        </div>
        <div class="project-grid">
            <article v-for="p in projects.items" :key="p._id" class="project-card">
                <div class="project-card-top">
                    <div class="project-symbol large" :class="p.color">✦</div><button
class="more-btn"
                        @click="remove(p)">···</button>
                </div>
                <h3>{{ p.name }}</h3>
                <p>{{ p.description || 'A space for your next great idea.' }}</p>
                <div class="project-progress">
                    <div><span>{{ p.openTasks || 0 }} open tasks</span><span>{{ taskCount(p._id) }} total</span></div>
                    <div class="progress-track"><span
:class="p.color"
                            :style="{ width: completion(p._id) + '%' }"/>
                    </div>
                </div>
                <NuxtLink to="/tasks" class="project-card-link">View tasks <span>↗</span></NuxtLink>
            </article><button class="project-add-card" @click="showCreate = true"><span>＋</span><b>Create a new
                    project</b><small>Start with a fresh canvas</small></button>
        </div>
        <div v-if="showCreate" class="modal-backdrop" @click.self="showCreate = false">
            <form class="modal" @submit.prevent="create">
                <div class="modal-head">
                    <div>
                        <div class="eyebrow">NEW WORKSPACE</div>
                        <h2>Create a project</h2>
                    </div><button type="button" class="icon-btn" @click="showCreate = false">×</button>
                </div><label>Project name<input
v-model.trim="form.name" required maxlength="120"
                        placeholder="e.g. Website refresh" ></label><label>Description<textarea
                        v-model="form.description" rows="3"
                        placeholder="What are you working toward?"/></label><label>Project color<div
                        class="color-options"><button
v-for="c in colors" :key="c" type="button"
                            :class="['color-choice', c, { chosen: form.color === c }]" @click="form.color = c"/>
                    </div>
                </label>
                <p v-if="error" class="form-error">{{ error }}</p>
                <div class="modal-actions"><button
type="button" class="btn ghost"
                        @click="showCreate = false">Cancel</button><button class="btn primary" :disabled="busy">{{ busy
                            ? 'Creating…' : 'Create project' }}</button></div>
            </form>
        </div>
    </NuxtLayout>
</template>
<script setup>
const projects = useProjectsStore(), tasks = useTasksStore(); const showCreate = ref(false), busy = ref(false), error = ref(''); const colors = ['violet', 'blue', 'cyan', 'pink', 'amber', 'green']; const form = reactive({ name: '', description: '', color: 'violet' });
onMounted(async () => { await Promise.all([projects.fetchAll(), tasks.fetchAll()]) });
async function create() { busy.value = true; error.value = ''; try { await projects.create(form); await projects.fetchAll(); Object.assign(form, { name: '', description: '', color: 'violet' }); showCreate.value = false } catch (e) { error.value = e.message } finally { busy.value = false } }
function taskCount(id) { return tasks.items.filter(t => (typeof t.project === 'object' ? t.project._id : t.project) === id).length }
function completion(id) { const list = tasks.items.filter(t => (typeof t.project === 'object' ? t.project._id : t.project) === id); return list.length ? Math.round(list.filter(t => t.status === 'done').length / list.length * 100) : 0 }
async function remove(p) { if (confirm(`Delete project “${p.name}” and its tasks?`)) { await projects.remove(p._id); await tasks.fetchAll() } }
</script>
