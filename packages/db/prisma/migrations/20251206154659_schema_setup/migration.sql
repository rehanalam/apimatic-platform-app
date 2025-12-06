-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('not_started', 'in_progress', 'completed', 'skipped');

-- CreateEnum
CREATE TYPE "UserIntent" AS ENUM ('sdks_and_portal', 'sdks_only');

-- CreateEnum
CREATE TYPE "RunTrigger" AS ENUM ('manual');

-- CreateEnum
CREATE TYPE "RunType" AS ENUM ('api_spec_change', 'docs_change', 'sdk_settings', 'portal_settings', 'full_rebuild');

-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('queued', 'building', 'awaiting_approval', 'approved', 'publishing', 'completed', 'failed', 'cancelled', 'disabled');

-- CreateEnum
CREATE TYPE "EnvironmentType" AS ENUM ('production', 'preview');

-- CreateEnum
CREATE TYPE "StageStatus" AS ENUM ('pending', 'in_progress', 'completed', 'failed', 'skipped', 'cancelled');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('validation', 'sdk_generation', 'portal_generation', 'version_calculation', 'git_push', 'pr_creation', 'registry_publish', 'portal_deploy');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('initializing', 'active', 'archived', 'deleted');

-- CreateEnum
CREATE TYPE "SdkStatus" AS ENUM ('not_configured', 'configured', 'generated', 'published');

-- CreateEnum
CREATE TYPE "SecretType" AS ENUM ('git_token', 'registry_token', 'api_key', 'ssh_key', 'webhook_secret');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_members" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'initializing',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_states" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "current_step" INTEGER NOT NULL DEFAULT 1,
    "status" "OnboardingStatus" NOT NULL DEFAULT 'not_started',
    "user_intent" "UserIntent",
    "has_api_spec" BOOLEAN NOT NULL DEFAULT false,
    "has_sdk_config" BOOLEAN NOT NULL DEFAULT false,
    "has_portal" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "skipped_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "walkthrough_states" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "walkthrough_key" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "dismissed_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "walkthrough_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_specs" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "file_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spec_health_scores" (
    "id" TEXT NOT NULL,
    "api_spec_id" TEXT NOT NULL,
    "overall_score" INTEGER NOT NULL,
    "completeness" INTEGER NOT NULL,
    "documentation" INTEGER NOT NULL,
    "best_practices" INTEGER NOT NULL,
    "issues" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "calculated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spec_health_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "runs" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "run_number" INTEGER NOT NULL,
    "trigger_type" "RunTrigger" NOT NULL,
    "run_type" "RunType" NOT NULL,
    "status" "RunStatus" NOT NULL DEFAULT 'queued',
    "environment" "EnvironmentType" NOT NULL DEFAULT 'production',
    "branch" TEXT,
    "commit_sha" TEXT,
    "triggered_by" TEXT,
    "changes_summary" JSONB,
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "run_stages" (
    "id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "status" "StageStatus" NOT NULL DEFAULT 'pending',
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "run_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "run_jobs" (
    "id" TEXT NOT NULL,
    "stage_id" TEXT NOT NULL,
    "type" "JobType" NOT NULL,
    "name" TEXT NOT NULL,
    "status" "StageStatus" NOT NULL DEFAULT 'pending',
    "output" JSONB,
    "logs" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "run_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "run_events" (
    "id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "run_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sdk_configs" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "version" TEXT,
    "status" "SdkStatus" NOT NULL DEFAULT 'not_configured',
    "repository_url" TEXT,
    "registry_url" TEXT,
    "package_name" TEXT,
    "configuration" JSONB,
    "last_generated_at" TIMESTAMP(3),
    "last_published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sdk_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sdk_artifacts" (
    "id" TEXT NOT NULL,
    "sdk_config_id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "checksum" TEXT NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sdk_artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_configs" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,
    "subdomain" TEXT,
    "custom_domain" TEXT,
    "title" TEXT,
    "description" TEXT,
    "logo_url" TEXT,
    "theme" JSONB,
    "custom_content" JSONB,
    "configuration" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_deployments" (
    "id" TEXT NOT NULL,
    "portal_config_id" TEXT NOT NULL,
    "environment" "EnvironmentType" NOT NULL,
    "version" TEXT NOT NULL,
    "deployed_url" TEXT NOT NULL,
    "deployed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portal_deployments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secrets" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SecretType" NOT NULL,
    "encrypted_value" TEXT NOT NULL,
    "description" TEXT,
    "last_used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "secrets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");

-- CreateIndex
CREATE INDEX "workspaces_slug_idx" ON "workspaces"("slug");

-- CreateIndex
CREATE INDEX "workspace_members_workspace_id_idx" ON "workspace_members"("workspace_id");

-- CreateIndex
CREATE INDEX "workspace_members_user_id_idx" ON "workspace_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_members_workspace_id_user_id_key" ON "workspace_members"("workspace_id", "user_id");

-- CreateIndex
CREATE INDEX "projects_workspace_id_idx" ON "projects"("workspace_id");

-- CreateIndex
CREATE INDEX "projects_slug_idx" ON "projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "projects_workspace_id_slug_key" ON "projects"("workspace_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_states_project_id_key" ON "onboarding_states"("project_id");

-- CreateIndex
CREATE INDEX "onboarding_states_project_id_idx" ON "onboarding_states"("project_id");

-- CreateIndex
CREATE INDEX "onboarding_states_status_idx" ON "onboarding_states"("status");

-- CreateIndex
CREATE INDEX "walkthrough_states_project_id_idx" ON "walkthrough_states"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "walkthrough_states_project_id_walkthrough_key_key" ON "walkthrough_states"("project_id", "walkthrough_key");

-- CreateIndex
CREATE INDEX "api_specs_project_id_idx" ON "api_specs"("project_id");

-- CreateIndex
CREATE INDEX "api_specs_is_active_idx" ON "api_specs"("is_active");

-- CreateIndex
CREATE INDEX "spec_health_scores_api_spec_id_idx" ON "spec_health_scores"("api_spec_id");

-- CreateIndex
CREATE INDEX "runs_project_id_idx" ON "runs"("project_id");

-- CreateIndex
CREATE INDEX "runs_status_idx" ON "runs"("status");

-- CreateIndex
CREATE INDEX "runs_environment_idx" ON "runs"("environment");

-- CreateIndex
CREATE UNIQUE INDEX "runs_project_id_run_number_key" ON "runs"("project_id", "run_number");

-- CreateIndex
CREATE INDEX "run_stages_run_id_idx" ON "run_stages"("run_id");

-- CreateIndex
CREATE UNIQUE INDEX "run_stages_run_id_order_key" ON "run_stages"("run_id", "order");

-- CreateIndex
CREATE INDEX "run_jobs_stage_id_idx" ON "run_jobs"("stage_id");

-- CreateIndex
CREATE INDEX "run_jobs_type_idx" ON "run_jobs"("type");

-- CreateIndex
CREATE INDEX "run_events_run_id_idx" ON "run_events"("run_id");

-- CreateIndex
CREATE INDEX "run_events_type_idx" ON "run_events"("type");

-- CreateIndex
CREATE INDEX "sdk_configs_project_id_idx" ON "sdk_configs"("project_id");

-- CreateIndex
CREATE INDEX "sdk_configs_status_idx" ON "sdk_configs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "sdk_configs_project_id_language_key" ON "sdk_configs"("project_id", "language");

-- CreateIndex
CREATE INDEX "sdk_artifacts_sdk_config_id_idx" ON "sdk_artifacts"("sdk_config_id");

-- CreateIndex
CREATE UNIQUE INDEX "portal_configs_project_id_key" ON "portal_configs"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "portal_configs_subdomain_key" ON "portal_configs"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "portal_configs_custom_domain_key" ON "portal_configs"("custom_domain");

-- CreateIndex
CREATE INDEX "portal_configs_project_id_idx" ON "portal_configs"("project_id");

-- CreateIndex
CREATE INDEX "portal_configs_subdomain_idx" ON "portal_configs"("subdomain");

-- CreateIndex
CREATE INDEX "portal_deployments_portal_config_id_idx" ON "portal_deployments"("portal_config_id");

-- CreateIndex
CREATE INDEX "portal_deployments_environment_idx" ON "portal_deployments"("environment");

-- CreateIndex
CREATE INDEX "secrets_project_id_idx" ON "secrets"("project_id");

-- CreateIndex
CREATE INDEX "secrets_type_idx" ON "secrets"("type");

-- CreateIndex
CREATE UNIQUE INDEX "secrets_project_id_name_key" ON "secrets"("project_id", "name");

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_states" ADD CONSTRAINT "onboarding_states_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "walkthrough_states" ADD CONSTRAINT "walkthrough_states_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_specs" ADD CONSTRAINT "api_specs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spec_health_scores" ADD CONSTRAINT "spec_health_scores_api_spec_id_fkey" FOREIGN KEY ("api_spec_id") REFERENCES "api_specs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "runs" ADD CONSTRAINT "runs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run_stages" ADD CONSTRAINT "run_stages_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run_jobs" ADD CONSTRAINT "run_jobs_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "run_stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run_events" ADD CONSTRAINT "run_events_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sdk_configs" ADD CONSTRAINT "sdk_configs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sdk_artifacts" ADD CONSTRAINT "sdk_artifacts_sdk_config_id_fkey" FOREIGN KEY ("sdk_config_id") REFERENCES "sdk_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_configs" ADD CONSTRAINT "portal_configs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_deployments" ADD CONSTRAINT "portal_deployments_portal_config_id_fkey" FOREIGN KEY ("portal_config_id") REFERENCES "portal_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secrets" ADD CONSTRAINT "secrets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
