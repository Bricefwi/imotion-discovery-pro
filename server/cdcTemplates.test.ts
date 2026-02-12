import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import type { Context } from './_core/context';

describe('CDC Templates', () => {
  const mockConsultantContext: Context = {
    user: {
      id: 1,
      openId: 'test-consultant',
      name: 'Test Consultant',
      email: 'consultant@test.com',
      role: 'consultant',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
  };

  const caller = appRouter.createCaller(mockConsultantContext);

  it('should create a new CDC template', async () => {
    const template = await caller.cdcTemplates.create({
      name: 'Template Test E-commerce',
      description: 'Template pour sites e-commerce',
      category: 'ecommerce',
      sections: [
        {
          id: 'section-1',
          title: 'Introduction',
          content: 'Projet pour {{client_name}} avec un budget de {{budget}}',
          order: 0,
          required: true,
          variables: ['{{client_name}}', '{{budget}}'],
        },
      ],
      isDefault: false,
      isPublic: false,
      tags: ['e-commerce', 'web'],
    });

    expect(template).toBeDefined();
    expect(template.name).toBe('Template Test E-commerce');
    expect(template.category).toBe('ecommerce');
    expect(template.consultantId).toBe(1);
  });

  it('should list consultant templates', async () => {
    const templates = await caller.cdcTemplates.list();
    expect(Array.isArray(templates)).toBe(true);
  });

  it('should get template by ID', async () => {
    // First create a template
    const created = await caller.cdcTemplates.create({
      name: 'Template Test Mobile',
      description: 'Template pour applications mobiles',
      category: 'mobile',
      sections: [
        {
          id: 'section-1',
          title: 'Contexte',
          content: 'Application mobile pour {{client_name}}',
          order: 0,
          required: true,
          variables: ['{{client_name}}'],
        },
      ],
      isDefault: false,
      isPublic: false,
      tags: ['mobile'],
    });

    const retrieved = await caller.cdcTemplates.getById({ id: created.id });
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('Template Test Mobile');
  });

  it('should update a template', async () => {
    // Create a template first
    const created = await caller.cdcTemplates.create({
      name: 'Template à modifier',
      description: 'Description initiale',
      category: 'web',
      sections: [],
      isDefault: false,
      isPublic: false,
      tags: [],
    });

    // Update it
    await caller.cdcTemplates.update({
      id: created.id,
      name: 'Template modifié',
      description: 'Description mise à jour',
    });

    const updated = await caller.cdcTemplates.getById({ id: created.id });
    expect(updated?.name).toBe('Template modifié');
    expect(updated?.description).toBe('Description mise à jour');
  });

  it('should delete a template', async () => {
    // Create a template first
    const created = await caller.cdcTemplates.create({
      name: 'Template à supprimer',
      description: 'Ce template sera supprimé',
      category: 'custom',
      sections: [],
      isDefault: false,
      isPublic: false,
      tags: [],
    });

    // Delete it
    const result = await caller.cdcTemplates.delete({ id: created.id });
    expect(result.success).toBe(true);

    // Verify it's deleted
    const deleted = await caller.cdcTemplates.getById({ id: created.id });
    expect(deleted).toBeUndefined();
  });

  it('should list public templates', async () => {
    // Create a public template
    await caller.cdcTemplates.create({
      name: 'Template Public',
      description: 'Template partagé',
      category: 'web',
      sections: [],
      isDefault: false,
      isPublic: true,
      tags: ['public'],
    });

    const publicTemplates = await caller.cdcTemplates.listPublic();
    expect(Array.isArray(publicTemplates)).toBe(true);
    expect(publicTemplates.some(t => t.name === 'Template Public')).toBe(true);
  });
});
