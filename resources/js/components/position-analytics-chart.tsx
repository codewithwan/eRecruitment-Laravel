import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PositionAnalyticsChartProps {
    data: { name: string; applicants: number; views: number }[];
}

export default function PositionAnalyticsChart({ data }: PositionAnalyticsChartProps) {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="applicants" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="views" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
