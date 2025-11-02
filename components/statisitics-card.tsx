import {
  ActivityIcon,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type Stats = {
  total: number;
  active: number;
  degraded: number;
  down: number;
  avgLatency: number;
  avgThroughput: number;
  issues: number;
};

export const StatisticsCard = (stats: Stats) => {
  return (
    <div className='grid grid-cols-2 gap-4 w-full'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Events</CardTitle>
          <ActivityIcon className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.total}</div>
          <p className='text-xs text-muted-foreground'>
            {stats.issues} with issues detected
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Active</CardTitle>
          <CheckCircle className='h-4 w-4 text-green-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-green-600'>
            {stats.active}
          </div>
          <p className='text-xs text-muted-foreground'>
            {((stats.active / stats.total) * 100).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Degraded</CardTitle>
          <AlertTriangle className='h-4 w-4 text-yellow-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-yellow-600'>
            {stats.degraded}
          </div>
          <p className='text-xs text-muted-foreground'>
            {((stats.degraded / stats.total) * 100).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Down</CardTitle>
          <XCircle className='h-4 w-4 text-red-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-red-600'>{stats.down}</div>
          <p className='text-xs text-muted-foreground'>
            {((stats.down / stats.total) * 100).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>

      <Card className='col-span-2'>
        <CardHeader>
          <CardTitle>Average Latency</CardTitle>
          <CardDescription>Mean latency across all nodes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-bold'>
            {stats.avgLatency.toFixed(2)} ms
          </div>
        </CardContent>
      </Card>
      {/* 
        <Card>
          <CardHeader>
            <CardTitle>Average Throughput</CardTitle>
            <CardDescription>Mean throughput across all nodes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>
              {stats.avgThroughput.toFixed(2)} Mbps
            </div>
          </CardContent>
        </Card> */}
    </div>
  );
};
