import { daemonClient } from '../daemon/client/client';
import { isOnDaemon } from '../daemon/is-on-daemon';
import { NxTaskHistory, TaskRun, TaskTarget } from '../native';
import { getDbConnection } from './db-connection';

export class TaskHistory {
  taskHistory = new NxTaskHistory(getDbConnection());

  /**
   * This function returns estimated timings per task
   * @param targets
   * @returns a map where key is task id (project:target:configuration), value is average time of historical runs
   */
  async getEstimatedTaskTimings(
    targets: TaskTarget[]
  ): Promise<Record<string, number>> {
    if (isOnDaemon() || !daemonClient.enabled()) {
      return this.taskHistory.getEstimatedTaskTimings(targets);
    }
    return await daemonClient.getEstimatedTaskTimings(targets);
  }

  async getFlakyTasks(hashes: string[]) {
    if (isOnDaemon() || !daemonClient.enabled()) {
      return this.taskHistory.getFlakyTasks(hashes);
    }
    return await daemonClient.getFlakyTasks(hashes);
  }

  async recordTaskRuns(taskRuns: TaskRun[]) {
    if (isOnDaemon() || !daemonClient.enabled()) {
      return this.taskHistory.recordTaskRuns(taskRuns);
    }
    return daemonClient.recordTaskRuns(taskRuns);
  }
}
