import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface WeeklyTrafficTrendsProps {
    position: string;
    positionId: number;
}

const generateWeeklyData = (positionId: number) => {
    const seed = positionId * 10;
    return [
        { week: 'Week 1', applicants: 10 + (seed % 15), views: 30 + (seed % 40) },
        { week: 'Week 2', applicants: 13 + (seed % 12), views: 42 + (seed % 30) },
        { week: 'Week 3', applicants: 18 + (seed % 10), views: 51 + (seed % 35) },
        { week: 'Week 4', applicants: 15 + (seed % 20), views: 46 + (seed % 25) },
        { week: 'Week 5', applicants: 20 + (seed % 15), views: 58 + (seed % 30) },
        { week: 'Week 6', applicants: 22 + (seed % 18), views: 64 + (seed % 38) },
    ];
};

export default function WeeklyTrafficTrends({ position, positionId }: WeeklyTrafficTrendsProps) {
    return (
        <div className="p-2">
            <h4 className="mb-2 font-medium">Weekly Traffic Trends for {position}</h4>
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateWeeklyData(positionId)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="week" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="applicants" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="views" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
