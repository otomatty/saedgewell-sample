import LexRank from '../utils/lexRank';
import { type LabelInterface, labels } from './labels';
import { type Priority, priorities } from './priorities';
import { type Project, projects } from './projects';
import { type Status, status } from './status';
import { type User, users } from './users';

// Helper functions to get data by index or throw/return undefined
function getStatusByIndex(index: number): Status {
  const s = status[index];
  if (s === undefined) {
    throw new Error(`Invalid status index used in mock data: ${index}`);
  }
  return s;
}

function getPriorityByIndex(index: number): Priority {
  const p = priorities[index];
  if (p === undefined) {
    throw new Error(`Invalid priority index used in mock data: ${index}`);
  }
  return p;
}

function getUserByIndex(index: number): User {
  const u = users[index];
  if (u === undefined) {
    throw new Error(`Invalid user index used in mock data: ${index}`);
  }
  return u;
}

function getLabelByIndex(index: number): LabelInterface {
  const l = labels[index];
  if (l === undefined) {
    throw new Error(`Invalid label index used in mock data: ${index}`);
  }
  return l;
}

function getProjectByIndex(index: number): Project | undefined {
  // Project is optional in Issue interface, so return undefined if not found
  return projects[index];
}

function getRankByIndex(index: number): string {
  const rank = ranks[index];
  if (rank === undefined) {
    throw new Error(`Invalid rank index used in mock data: ${index}`);
  }
  return rank;
}

export interface Issue {
  id: string;
  identifier: string;
  title: string;
  description: string;
  status: Status;
  assignees: User | null;
  priority: Priority;
  labels: LabelInterface[];
  createdAt: string;
  cycleId: string;
  project?: Project;
  subissues?: string[];
  rank: string;
}

// generates issues ranks using LexoRank algorithm.
export const ranks: string[] = [];
const generateIssuesRanks = () => {
  const firstRank = new LexRank('a3c');
  ranks.push(firstRank.toString());
  for (let i = 1; i < 30; i++) {
    const previousRankValue = ranks[i - 1];
    if (previousRankValue === undefined) {
      // This should logically never happen due to the loop structure
      throw new Error(`Unexpected undefined rank at index ${i - 1}`);
    }
    const previousRank = LexRank.from(previousRankValue);
    const currentRank = previousRank.increment();
    ranks.push(currentRank.toString());
  }
};
generateIssuesRanks();

export const issues: Issue[] = [
  {
    id: '1',
    identifier: 'LNUI-101',
    title: 'Refactor Button component for full accessibility compliance',
    description: '',
    status: getStatusByIndex(5),
    priority: getPriorityByIndex(2),
    assignees: getUserByIndex(0),
    labels: [getLabelByIndex(0)],
    createdAt: '2025-03-08',
    cycleId: '42',
    project: getProjectByIndex(0),
    rank: getRankByIndex(0),
  },
  {
    id: '2',
    identifier: 'LNUI-204',
    title: 'Optimize animations for smoother UI transitions',
    description: '',
    status: getStatusByIndex(2),
    priority: getPriorityByIndex(1),
    assignees: getUserByIndex(1),
    labels: [getLabelByIndex(1)],
    createdAt: '2025-03-12',
    cycleId: '42',
    subissues: ['1', '3'],
    rank: getRankByIndex(1),
  },
  {
    id: '3',
    identifier: 'LNUI-309',
    title: 'Implement dark mode toggle with system preferences support',
    description: '',
    status: getStatusByIndex(3),
    priority: getPriorityByIndex(1),
    assignees: getUserByIndex(1),
    labels: [getLabelByIndex(2)],
    createdAt: '2025-03-14',
    cycleId: '42',
    project: getProjectByIndex(1),
    rank: getRankByIndex(2),
  },
  {
    id: '4',
    identifier: 'LNUI-415',
    title: 'Design new modal system with focus trapping',
    description: '',
    status: getStatusByIndex(1),
    priority: getPriorityByIndex(2),
    assignees: getUserByIndex(3),
    labels: [getLabelByIndex(3)],
    createdAt: '2025-03-09',
    cycleId: '42',
    project: getProjectByIndex(2),
    rank: getRankByIndex(3),
  },
  {
    id: '5',
    identifier: 'LNUI-501',
    title: 'Enhance responsiveness of Navbar',
    description: '',
    status: getStatusByIndex(1),
    priority: getPriorityByIndex(3),
    assignees: getUserByIndex(0),
    labels: [getLabelByIndex(4)],
    createdAt: '2025-03-10',
    cycleId: '42',
    project: getProjectByIndex(4),
    subissues: ['8', '9'],
    rank: getRankByIndex(4),
  },
  {
    id: '6',
    identifier: 'LNUI-502',
    title: 'Optimize loading time of Footer',
    description: '',
    status: getStatusByIndex(2),
    priority: getPriorityByIndex(0),
    assignees: getUserByIndex(0),
    labels: [getLabelByIndex(5)],
    createdAt: '2025-03-11',
    cycleId: '42',
    project: getProjectByIndex(5),
    rank: getRankByIndex(5),
  },
  {
    id: '7',
    identifier: 'LNUI-503',
    title: 'Refactor Sidebar for better accessibility',
    description: '',
    status: getStatusByIndex(3),
    priority: getPriorityByIndex(1),
    assignees: getUserByIndex(2),
    labels: [getLabelByIndex(6)],
    createdAt: '2025-03-12',
    cycleId: '42',
    project: getProjectByIndex(5),
    rank: getRankByIndex(6),
  },
  {
    id: '8',
    identifier: 'LNUI-504',
    title: 'Implement new Card component design',
    description: '',
    status: getStatusByIndex(4),
    priority: getPriorityByIndex(3),
    assignees: getUserByIndex(3),
    labels: [getLabelByIndex(7)],
    createdAt: '2025-03-13',
    cycleId: '42',
    project: getProjectByIndex(6),
    rank: getRankByIndex(7),
  },
  {
    id: '9',
    identifier: 'LNUI-505',
    title: 'Improve Tooltip interactivity',
    description: '',
    status: getStatusByIndex(1),
    priority: getPriorityByIndex(2),
    assignees: getUserByIndex(2),
    labels: [getLabelByIndex(8)],
    createdAt: '2025-03-14',
    cycleId: '42',
    project: getProjectByIndex(6),
    rank: getRankByIndex(8),
  },
  {
    id: '10',
    identifier: 'LNUI-506',
    title: 'Redesign Dropdown for mobile devices',
    description: '',
    status: getStatusByIndex(2),
    priority: getPriorityByIndex(1),
    assignees: getUserByIndex(1),
    labels: [getLabelByIndex(9)],
    createdAt: '2025-03-15',
    cycleId: '42',
    project: getProjectByIndex(7),
    rank: getRankByIndex(9),
  },
  {
    id: '11',
    identifier: 'LNUI-507',
    title: 'Fix Form validation issues',
    description: '',
    status: getStatusByIndex(3),
    priority: getPriorityByIndex(1),
    assignees: null,
    labels: [getLabelByIndex(10)],
    createdAt: '2025-03-16',
    cycleId: '42',
    project: getProjectByIndex(7),
    rank: getRankByIndex(10),
  },
  {
    id: '12',
    identifier: 'LNUI-508',
    title: 'Update Modal animations',
    description: '',
    status: getStatusByIndex(0),
    priority: getPriorityByIndex(2),
    assignees: getUserByIndex(1),
    labels: [getLabelByIndex(9)],
    createdAt: '2025-03-17',
    cycleId: '42',
    project: getProjectByIndex(8),
    rank: getRankByIndex(11),
  },
  {
    id: '13',
    identifier: 'LNUI-509',
    title: 'Revamp Button states and interactions',
    description: '',
    status: getStatusByIndex(5),
    priority: getPriorityByIndex(1),
    assignees: getUserByIndex(1),
    labels: [getLabelByIndex(3)],
    createdAt: '2025-03-18',
    cycleId: '42',
    project: getProjectByIndex(8),
    rank: getRankByIndex(12),
  },
  {
    id: '14',
    identifier: 'LNUI-510',
    title: 'Streamline Input component styling',
    description: '',
    status: getStatusByIndex(2),
    priority: getPriorityByIndex(2),
    assignees: getUserByIndex(2),
    labels: [getLabelByIndex(9)],
    createdAt: '2025-03-19',
    cycleId: '42',
    project: getProjectByIndex(9),
    rank: getRankByIndex(13),
  },
  {
    id: '15',
    identifier: 'LNUI-511',
    title: 'Integrate new Select component behavior',
    description: '',
    status: getStatusByIndex(3),
    priority: getPriorityByIndex(1),
    assignees: getUserByIndex(0),
    labels: [getLabelByIndex(4)],
    createdAt: '2025-03-20',
    cycleId: '42',
    project: getProjectByIndex(9),
    rank: getRankByIndex(14),
  },
  {
    id: '16',
    identifier: 'LNUI-512',
    title: 'Enhance Breadcrumb navigation usability',
    description: '',
    status: getStatusByIndex(0),
    priority: getPriorityByIndex(3),
    assignees: getUserByIndex(0),
    labels: [getLabelByIndex(5)],
    createdAt: '2025-03-21',
    cycleId: '42',
    project: getProjectByIndex(9),
    rank: getRankByIndex(15),
  },
  {
    id: '17',
    identifier: 'LNUI-513',
    title: 'Refactor Accordion for smoother transitions',
    description: '',
    status: getStatusByIndex(1),
    priority: getPriorityByIndex(2),
    assignees: null,
    labels: [getLabelByIndex(3)],
    createdAt: '2025-03-22',
    cycleId: '42',
    project: getProjectByIndex(0),
    rank: getRankByIndex(16),
  },
  {
    id: '18',
    identifier: 'LNUI-514',
    title: 'Implement Carousel with lazy loading',
    description: '',
    status: getStatusByIndex(2),
    priority: getPriorityByIndex(1),
    assignees: getUserByIndex(1),
    labels: [getLabelByIndex(6)],
    createdAt: '2025-03-23',
    cycleId: '42',
    project: getProjectByIndex(0),
    rank: getRankByIndex(17),
  },
  {
    id: '19',
    identifier: 'LNUI-515',
    title: 'Optimize Grid layout for responsive design',
    description: '',
    status: getStatusByIndex(3),
    priority: getPriorityByIndex(2),
    assignees: null,
    labels: [getLabelByIndex(7)],
    createdAt: '2025-03-24',
    cycleId: '42',
    project: getProjectByIndex(0),
    rank: getRankByIndex(18),
  },
  {
    id: '20',
    identifier: 'LNUI-516',
    title: 'Update Typography system for clarity',
    description: '',
    status: getStatusByIndex(4),
    priority: getPriorityByIndex(3),
    assignees: getUserByIndex(3),
    labels: [getLabelByIndex(5)],
    createdAt: '2025-03-25',
    cycleId: '42',
    project: getProjectByIndex(0),
    rank: getRankByIndex(19),
  },
  {
    id: '21',
    identifier: 'LNUI-517',
    title: 'Improve Color scheme consistency',
    description: '',
    status: getStatusByIndex(1),
    priority: getPriorityByIndex(0),
    assignees: getUserByIndex(0),
    labels: [getLabelByIndex(5)],
    createdAt: '2025-03-26',
    cycleId: '42',
    project: getProjectByIndex(1),
    rank: getRankByIndex(20),
  },
  {
    id: '22',
    identifier: 'LNUI-518',
    title: 'Design new Icon set for better scalability',
    description: '',
    status: getStatusByIndex(2),
    priority: getPriorityByIndex(1),
    assignees: getUserByIndex(0),
    labels: [getLabelByIndex(5)],
    createdAt: '2025-03-27',
    cycleId: '42',
    project: getProjectByIndex(1),
    rank: getRankByIndex(21),
  },
  {
    id: '23',
    identifier: 'LNUI-519',
    title: 'Fix Notification system timing',
    description: '',
    status: getStatusByIndex(3),
    priority: getPriorityByIndex(2),
    assignees: getUserByIndex(2),
    labels: [getLabelByIndex(8)],
    createdAt: '2025-03-28',
    cycleId: '42',
    project: getProjectByIndex(4),
    rank: getRankByIndex(22),
  },
  {
    id: '24',
    identifier: 'LNUI-520',
    title: 'Enhance Loading indicator performance',
    description: '',
    status: getStatusByIndex(0),
    priority: getPriorityByIndex(1),
    assignees: getUserByIndex(3),
    labels: [getLabelByIndex(9)],
    createdAt: '2025-03-29',
    cycleId: '42',
    project: getProjectByIndex(3),
    rank: getRankByIndex(23),
  },
  {
    id: '25',
    identifier: 'LNUI-521',
    title: 'Refactor Progress bar animations',
    description: '',
    status: getStatusByIndex(5),
    priority: getPriorityByIndex(2),
    assignees: getUserByIndex(3),
    labels: [getLabelByIndex(6)],
    createdAt: '2025-03-30',
    cycleId: '42',
    project: getProjectByIndex(3),
    rank: getRankByIndex(24),
  },
  {
    id: '26',
    identifier: 'LNUI-522',
    title: 'Optimize Table component sorting',
    description: '',
    status: getStatusByIndex(2),
    priority: getPriorityByIndex(3),
    assignees: getUserByIndex(1),
    labels: [getLabelByIndex(7)],
    createdAt: '2025-03-31',
    cycleId: '42',
    project: getProjectByIndex(6),
    rank: getRankByIndex(25),
  },
  {
    id: '27',
    identifier: 'LNUI-523',
    title: 'Improve Pagination logic',
    description: '',
    status: getStatusByIndex(3),
    priority: getPriorityByIndex(0),
    assignees: getUserByIndex(0),
    labels: [getLabelByIndex(8)],
    createdAt: '2025-04-01',
    cycleId: '42',
    project: getProjectByIndex(6),
    rank: getRankByIndex(26),
  },
  {
    id: '28',
    identifier: 'LNUI-524',
    title: 'Implement Search bar with auto-complete',
    description: '',
    status: getStatusByIndex(0),
    priority: getPriorityByIndex(1),
    assignees: getUserByIndex(3),
    labels: [getLabelByIndex(5)],
    createdAt: '2025-04-02',
    cycleId: '42',
    project: getProjectByIndex(5),
    rank: getRankByIndex(27),
  },
  {
    id: '29',
    identifier: 'LNUI-525',
    title: 'Update Alert system for critical notifications',
    description: '',
    status: getStatusByIndex(1),
    priority: getPriorityByIndex(2),
    assignees: null,
    labels: [getLabelByIndex(9)],
    createdAt: '2025-04-03',
    cycleId: '42',
    project: getProjectByIndex(5),
    rank: getRankByIndex(28),
  },
  {
    id: '30',
    identifier: 'LNUI-526',
    title: 'Revise Overlay for better usability',
    description: '',
    status: getStatusByIndex(2),
    priority: getPriorityByIndex(3),
    assignees: getUserByIndex(3),
    labels: [getLabelByIndex(8)],
    createdAt: '2025-04-04',
    cycleId: '42',
    project: getProjectByIndex(1),
    rank: getRankByIndex(29),
  },
];

export function groupIssuesByStatus(issues: Issue[]): Record<string, Issue[]> {
  return issues.reduce<Record<string, Issue[]>>((acc, issue) => {
    const statusId = issue.status.id;

    if (!acc[statusId]) {
      acc[statusId] = [];
    }

    acc[statusId].push(issue);

    return acc;
  }, {});
}

export function sortIssuesByPriority(issues: Issue[]): Issue[] {
  const priorityOrder: Record<string, number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3,
    'no-priority': 4,
  };
  const defaultPriorityValue = priorityOrder['no-priority'];

  // Add assertion check for defaultPriorityValue
  if (defaultPriorityValue === undefined) {
    // This should not happen based on the object literal definition
    throw new Error(
      "Default priority 'no-priority' is unexpectedly missing in priorityOrder."
    );
  }

  // Modified helper function to directly check lookup result
  const getPriorityValue = (priority: Priority | undefined): number => {
    if (!priority) {
      return defaultPriorityValue;
    }
    // Directly lookup the value
    const value = priorityOrder[priority.id];
    // Check if the lookup result is undefined
    if (value === undefined) {
      return defaultPriorityValue;
    }
    // Return the found number
    return value;
  };

  return issues.slice().sort((a, b) => {
    const valueA = getPriorityValue(a.priority);
    const valueB = getPriorityValue(b.priority);
    return valueA - valueB;
  });
}
