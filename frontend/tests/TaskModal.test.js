import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TaskModal from '../components/TaskModal.vue';

describe('TaskModal', () => {
  it('renders create task form correctly', () => {
    const projects = [
      {
        _id: 'project-1',
        name: 'TaskNest'
      },
      {
        _id: 'project-2',
        name: 'Website Project'
      }
    ];

    const wrapper = mount(TaskModal, {
      props: {
        projects
      }
    });

    expect(wrapper.text()).toContain('Create a task');
    expect(wrapper.find('input[placeholder="What needs to get done?"]').exists()).toBe(true);

    const options = wrapper.findAll('select option');

    expect(options.some(option => option.text() === 'TaskNest')).toBe(true);
    expect(options.some(option => option.text() === 'Website Project')).toBe(true);
  });
});