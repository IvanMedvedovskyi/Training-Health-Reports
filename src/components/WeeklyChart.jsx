// components/WeeklyChartPro.jsx
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const C = {
  week: "Vecka nr",
  name: "Namn",
  swim: "Hur många simträningar har du gjort denna vecka?",
  gym: "Hur många gympass har du gjort denna vecka?",
  competition: "Hur många tävlingsdagar har du gjort denna vecka?",
  other: 'Hur många "övriga" pass har du gjort denna vecka?',
  sick: 'Hur många "dagar har du vart sjuk denna vecka (sjuk=ej tillräcklig frisk för att träna)?',
  feeling: "Hur tycker du att simträningen gått denna vecka?",
};

function buildChartData(rows, person) {
  const src =
    person && person !== "All"
      ? rows.filter((r) => r[C.name] === person)
      : rows;

  const byWeek = new Map();

  for (const r of src) {
    const w = Number(r[C.week]);
    const swim = Number(r[C.swim]) || 0;
    const gym = Number(r[C.gym]) || 0;
    const competition = Number(r[C.competition]) || 0;
    const other = Number(r[C.other]) || 0;
    const sick = Number(r[C.sick]) || 0;
    const feeling = Number(r[C.feeling]) || 0;

    if (!byWeek.has(w)) {
      byWeek.set(w, {
        week: w,
        _n: 0,
        swim: 0,
        gym: 0,
        competition: 0,
        other: 0,
        sick: 0,
        feeling: 0,
      });
    }

    const a = byWeek.get(w);
    a._n++;
    a.swim += swim;
    a.gym += gym;
    a.competition += competition;
    a.other += other;
    a.sick += sick;
    a.feeling += feeling;
  }

  return [...byWeek.values()]
    .map((d) => ({
      week: d.week,
      swim: +(d.swim / d._n).toFixed(1),
      gym: +(d.gym / d._n).toFixed(1),
      competition: +(d.competition / d._n).toFixed(1),
      other: +(d.other / d._n).toFixed(1),
      sick: +(d.sick / d._n).toFixed(1),
      feeling: +(d.feeling / d._n).toFixed(1),
    }))
    .sort((a, b) => a.week - b.week);
}

const SeriesSwitch = ({ label, checked, onChange }) => (
  <label
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 10px",
      border: "1px solid #e2e8f0",
      borderRadius: 999,
    }}
  >
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span>{label}</span>
  </label>
);

const CustomTooltip = ({ active, label, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "10px 12px",
        boxShadow: "0 8px 24px rgba(0,0,0,.08)",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{`Week ${label}`}</div>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
        >
          <span>{p.name}</span>
          <span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function WeeklyChartPro({ rows }) {
  const [person] = useState("All");
  const [show, setShow] = useState({
    swim: true,
    gym: true,
    competition: false,
    other: false,
    sick: true,
    feeling: true,
  });
  const data = useMemo(() => buildChartData(rows, person), [rows, person]);

  return (
    <div
      style={{
        marginTop: 16,
        padding: 16,
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap" }}>
          <SeriesSwitch
            label="Swimming"
            checked={show.swim}
            onChange={() => setShow((s) => ({ ...s, swim: !s.swim }))}
          />
          <SeriesSwitch
            label="Gym"
            checked={show.gym}
            onChange={() => setShow((s) => ({ ...s, gym: !s.gym }))}
          />
          <SeriesSwitch
            label="Competition days"
            checked={show.competition}
            onChange={() =>
              setShow((s) => ({ ...s, competition: !s.competition }))
            }
          />
          <SeriesSwitch
            label="Other sessions"
            checked={show.other}
            onChange={() => setShow((s) => ({ ...s, other: !s.other }))}
          />
          <SeriesSwitch
            label="Sick days"
            checked={show.sick}
            onChange={() => setShow((s) => ({ ...s, sick: !s.sick }))}
          />
          <SeriesSwitch
            label="Feeling"
            checked={show.feeling}
            onChange={() => setShow((s) => ({ ...s, feeling: !s.feeling }))}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 6" stroke="#e2e8f0" />
          <XAxis
            dataKey="week"
            tickFormatter={(w) => `W${w}`}
            tick={{ fill: "#475569" }}
          />

          {/* Y оси */}
          <YAxis yAxisId="trainings" tick={{ fill: "#475569" }} />
          <YAxis
            yAxisId="sick"
            orientation="right"
            domain={[0, 7]}
            tick={{ fill: "#ef4444" }}
          />
          <YAxis
            yAxisId="feeling"
            orientation="right"
            domain={[0, 10]}
            tick={{ fill: "#f59e0b" }}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: 8 }} />

          {/* Stack тренировок */}
          {show.swim && (
            <Bar
              yAxisId="trainings"
              dataKey="swim"
              name="Swimming"
              stackId="train"
              fill="#3b82f6"
              fillOpacity={0.7}
            />
          )}
          {show.gym && (
            <Bar
              yAxisId="trainings"
              dataKey="gym"
              name="Gym"
              stackId="train"
              fill="#10b981"
              fillOpacity={0.7}
            />
          )}
          {show.competition && (
            <Bar
              yAxisId="trainings"
              dataKey="competition"
              name="Competition"
              stackId="train"
              fill="#8b5cf6"
              fillOpacity={0.7}
            />
          )}
          {show.other && (
            <Bar
              yAxisId="trainings"
              dataKey="other"
              name="Other"
              stackId="train"
              fill="#f97316"
              fillOpacity={0.7}
            />
          )}

          {/* Sick отдельной линией */}
          {show.sick && (
            <Line
              yAxisId="sick"
              type="monotone"
              dataKey="sick"
              name="Sick days"
              stroke="#ef4444"
              strokeWidth={2}
              dot
            />
          )}

          {/* Feeling отдельной толстой линией */}
          {show.feeling && (
            <Line
              yAxisId="feeling"
              type="monotone"
              dataKey="feeling"
              name="Feeling"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      <div style={{ marginTop: 8, color: "#94a3b8", fontSize: 12 }}>
        Tip: toggle series above to focus on what matters.
      </div>
    </div>
  );
}
