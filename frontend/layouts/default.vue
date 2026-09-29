<template>
  <div class="shell">
    <aside class="sidebar">
      <NuxtLink to="/" class="brand"><span class="brand-mark">✦</span><span>tasknest</span></NuxtLink>
      <div class="side-label">WORKSPACE</div>
      <NuxtLink to="/" class="nav-link"><span>▦</span> Overview</NuxtLink>
      <NuxtLink to="/projects" class="nav-link"><span>▣</span> Projects</NuxtLink>
      <NuxtLink to="/tasks" class="nav-link"><span>☷</span> My tasks</NuxtLink>
      <div class="side-bottom">
        <div class="user-chip"><div class="avatar">{{ initials }}</div><div class="user-info"><b>{{ auth.user?.name }}</b><small>{{ auth.user?.email }}</small></div></div>
        <button class="logout" @click="auth.logout()">↗ <span>Sign out</span></button>
      </div>
    </aside>
    <main class="main-area">
      <header class="topbar"><div><div class="eyebrow">YOUR WORKSPACE</div><div class="welcome">Make progress, <span>{{ firstName }}</span>.</div></div><div class="top-actions"><span class="live-dot"/> Workspace active <div class="avatar small">{{ initials }}</div></div></header>
      <section class="page-content"><slot /></section>
    </main>
  </div>
</template>
<script setup>
const auth = useAuthStore();
const firstName = computed(() => auth.user?.name?.split(' ')[0] || 'there');
const initials = computed(() => (auth.user?.name || 'TN').split(' ').map(x => x[0]).join('').slice(0,2).toUpperCase());
</script>
