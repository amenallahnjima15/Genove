import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { monthlyProgression, weeklyActivity, monthlyActivity, skillsRadar } from "./mock-data";

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: 12,
  boxShadow: "var(--shadow-md)",
};

export function ProgressionAreaChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={monthlyProgression} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="progressionFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
        />
        <Area
          type="monotone"
          dataKey="progression"
          stroke="var(--primary)"
          strokeWidth={2.5}
          fill="url(#progressionFill)"
          name="Progression (%)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function WeeklyBarChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={weeklyActivity} margin={{ top: 10, right: 8, bottom: 0, left: -24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
          cursor={{ fill: "var(--muted)" }}
        />
        <Bar
          dataKey="heures"
          name="Heures"
          fill="var(--accent)"
          radius={[6, 6, 0, 0]}
          maxBarSize={22}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MonthlyActivityChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={monthlyActivity} margin={{ top: 10, right: 8, bottom: 0, left: -24 }}>
        <defs>
          <linearGradient id="monthlyFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
        />
        <Area
          type="monotone"
          dataKey="heures"
          name="Heures"
          stroke="var(--accent)"
          strokeWidth={2.5}
          fill="url(#monthlyFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SkillsRadarChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={skillsRadar} outerRadius="72%">
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fill: "var(--muted-foreground)", fontSize: 10.5 }}
        />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Niveau"
          dataKey="niveau"
          stroke="var(--primary)"
          fill="var(--accent)"
          fillOpacity={0.4}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
