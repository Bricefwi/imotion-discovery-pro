import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';
import type { Context } from './_core/context';

describe('Document Preview', () => {
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

  it('should preview CDC document', async () => {
    // First create a test project
    const project = await caller.projects.create({
      title: 'Projet Test Prévisualisation',
      description: 'Test de prévisualisation de document',
      clientId: 1,
      status: 'discovery',
      priority: 'medium',
    });

    // Preview the CDC
    const preview = await caller.documents.previewDocument({
      projectId: project.id,
      type: 'cdc',
    });

    expect(preview).toBeDefined();
    expect(preview.markdown).toBeDefined();
    expect(preview.markdown.length).toBeGreaterThan(0);
    expect(preview.projectTitle).toBe('Projet Test Prévisualisation');
  });

  it('should preview contract document', async () => {
    // Create a test project
    const project = await caller.projects.create({
      title: 'Projet Test Contrat',
      description: 'Test de prévisualisation de contrat',
      clientId: 1,
      status: 'discovery',
      priority: 'medium',
    });

    // Preview the contract
    const preview = await caller.documents.previewDocument({
      projectId: project.id,
      type: 'contract',
    });

    expect(preview).toBeDefined();
    expect(preview.markdown).toBeDefined();
    expect(preview.markdown.length).toBeGreaterThan(0);
    expect(preview.projectTitle).toBe('Projet Test Contrat');
  });

  it('should fail to preview non-existent project', async () => {
    await expect(
      caller.documents.previewDocument({
        projectId: 999999,
        type: 'cdc',
      })
    ).rejects.toThrow('Project not found');
  });
});
