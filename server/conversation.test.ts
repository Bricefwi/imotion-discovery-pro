import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createClientContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-client",
    email: "client@test.com",
    name: "Test Client",
    loginMethod: "manus",
    role: "client",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createConsultantContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "test-consultant",
    email: "consultant@imotion.fr",
    name: "Test Consultant",
    loginMethod: "manus",
    role: "consultant",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Project Creation", () => {
  it("should allow authenticated client to create a project", async () => {
    const ctx = createClientContext();
    const caller = appRouter.createCaller(ctx);

    const project = await caller.projects.create({
      title: "Test Project - E-commerce Website",
    });

    expect(project).toBeDefined();
    expect(project.title).toBe("Test Project - E-commerce Website");
    expect(project.clientId).toBe(ctx.user!.id);
    expect(project.status).toBe("active");
    expect(project.currentPhase).toBe(1);
  });
});

describe("Project Access Control", () => {
  it("should allow client to access their own project", async () => {
    const ctx = createClientContext();
    const caller = appRouter.createCaller(ctx);

    const created = await caller.projects.create({
      title: "My Project",
    });

    const fetched = await caller.projects.getById({ id: created.id });
    expect(fetched).toBeDefined();
    expect(fetched.id).toBe(created.id);
  });

  it("should allow consultant to access any project", async () => {
    const clientCtx = createClientContext();
    const clientCaller = appRouter.createCaller(clientCtx);

    const project = await clientCaller.projects.create({
      title: "Client Project",
    });

    const consultantCtx = createConsultantContext();
    const consultantCaller = appRouter.createCaller(consultantCtx);

    const fetched = await consultantCaller.projects.getById({ id: project.id });
    expect(fetched).toBeDefined();
    expect(fetched.id).toBe(project.id);
  });
});

describe("Conversation Flow", () => {
  it("should create initial AI message when project is created", async () => {
    const ctx = createClientContext();
    const caller = appRouter.createCaller(ctx);

    const project = await caller.projects.create({
      title: "New Project",
    });

    const messages = await caller.conversation.getHistory({
      projectId: project.id,
    });

    expect(messages).toBeDefined();
    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0]?.role).toBe("assistant");
    expect(messages[0]?.phase).toBe(1);
  });
});

describe("Project Listing", () => {
  it("should return only client's projects for client role", async () => {
    const ctx = createClientContext();
    const caller = appRouter.createCaller(ctx);

    await caller.projects.create({ title: "Project 1" });

    const projects = await caller.projects.list();

    expect(projects).toBeDefined();
    expect(projects.length).toBeGreaterThanOrEqual(1);
    expect(projects.every(p => p.clientId === ctx.user!.id)).toBe(true);
  }, 10000);

  it("should return all projects for consultant role", async () => {
    const clientCtx = createClientContext();
    const clientCaller = appRouter.createCaller(clientCtx);

    await clientCaller.projects.create({ title: "Client Project" });

    const consultantCtx = createConsultantContext();
    const consultantCaller = appRouter.createCaller(consultantCtx);

    const projects = await consultantCaller.projects.list();

    expect(projects).toBeDefined();
    expect(projects.length).toBeGreaterThan(0);
  });
});
