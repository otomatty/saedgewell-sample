'use client';

import type React from 'react';
import { useState } from 'react';
import type { ContributionDay } from '~/types/share/github';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GithubContributionChartProps {
  contributions: ContributionDay[];
}

const groupByYear = (
  contributions: ContributionDay[]
): { [year: string]: ContributionDay[] } => {
  return contributions.reduce(
    (acc: { [year: string]: ContributionDay[] }, day) => {
      const year = new Date(day.date).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(day);
      return acc;
    },
    {}
  );
};

/**
 * GitHubのコントリビューションチャートを表示するコンポーネント
 */
export const GithubContributionChart: React.FC<
  GithubContributionChartProps
> = ({ contributions }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();

  const contributionsByYear = groupByYear(contributions);
  const currentYearContributions = contributionsByYear[currentYear] || [];

  const data = currentYearContributions
    .filter((day) => new Date(day.date).getMonth() === currentMonth)
    .map((day) => ({
      date: day.date,
      contributions: day.count,
    }));

  const handlePrevMonth = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="contributions" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex gap-2">
        <button
          onClick={handlePrevMonth}
          type="button"
          className="p-2 border rounded-full"
        >
          <ChevronLeft />
        </button>
        <h3 className="text-lg font-bold p-2">
          {currentYear}年 {currentMonth + 1}月
        </h3>
        <button
          onClick={handleNextMonth}
          type="button"
          className="p-2 border rounded-full"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
