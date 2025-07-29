import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

const radialData = [{ name: "Saving", value: 60, fill: "#28c76f" }];

export const SavingsProgress = () => (
  <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
    <RadialBarChart
      width={150}
      height={150}
      cx="50%"
      cy="50%"
      innerRadius="70%"
      outerRadius="100%"
      barSize={12}
      data={radialData}
      startAngle={90}
      endAngle={450}
    >
      <PolarAngleAxis
        type="number"
        domain={[0, 100]}
        angleAxisId={0}
        tick={false}
      />
      <RadialBar background dataKey="value" />
    </RadialBarChart>
  </div>
);
