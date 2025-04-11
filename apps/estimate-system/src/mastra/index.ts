import { Mastra } from '@mastra/core';
import { VercelDeployer } from '@mastra/deployer-vercel';
import {
  estimationExecutionWorkflow,
  questionGenerationWorkflow,
} from './workflows';
// import { createLogger } from '@mastra/core/logger';

// VERCEL_TOKEN が設定されていなければエラーを投げる
const vercelToken = process.env.VERCEL_TOKEN;
const vercelTeamSlug = process.env.VERCEL_TEAM_SLUG;
const vercelProjectName = process.env.VERCEL_PROJECT_NAME;

if (!vercelToken || !vercelTeamSlug || !vercelProjectName) {
  throw new Error(
    'VERCEL_TOKEN, VERCEL_TEAM_SLUG, and VERCEL_PROJECT_NAME environment variables are not set.'
  );
}

export const mastra = new Mastra({
  workflows: { estimationExecutionWorkflow, questionGenerationWorkflow },
  deployer: new VercelDeployer({
    teamSlug: vercelTeamSlug,
    projectName: vercelProjectName,
    token: vercelToken,
  }),
});
