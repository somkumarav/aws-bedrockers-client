"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { NetworkEvent, parseCSV } from "@/lib/csv-parser";
import { Search } from "lucide-react";
import { StatisticsCard } from "@/components/statisitics-card";
import { MarkdownViewer } from "@/components/ui/markdown-viewer";

const csvData = `issue_type,probability,timestamp,tower_id,node_id,region,latency_ms,packet_loss_percent,throughput_mbps,cpu_usage_percent,memory_usage_percent,disk_io,retry_count,connection_duration_sec,error_code,status,event_type
no_issue,0.9962864,2025-09-28T00:17:13.760655,T038,N104,South,13,0.83,141.87,12.54,54.78,820,0,4849,,degraded,congestion
latency_spike,0.623487,2025-10-19T11:59:17.760655,T003,N118,West,503,12.06,11.98,93.17,94.48,1929,9,42,E505,degraded,reconnect
no_issue,0.99672157,2025-10-12T00:38:10.760655,T013,N074,East,27,1.46,185.66,45.96,32.08,113,0,256,E404,down,normal
resource_exhaustion,0.4136866,2025-10-25T20:02:36.760655,T044,N188,West,479,12.18,2.28,96.16,96.09,1996,6,23,E303,degraded,reconnect
no_issue,0.99670094,2025-10-20T14:13:14.760655,T039,N003,South,54,0.8,186.31,13.94,33.69,709,1,3376,E202,degraded,congestion
no_issue,0.9965586,2025-10-18T12:55:24.760655,T046,N006,North,26,1.39,132.24,29.14,44.93,430,0,7264,E101,degraded,congestion
no_issue,0.99661225,2025-10-16T03:32:27.760655,T045,N138,North,92,0.3,91.44,58.92,73.66,823,2,425,E101,down,drop
packet_loss,0.7884601,2025-10-17T20:41:08.760655,T013,N186,West,569,13.47,1.4,94.24,98.05,1959,7,44,E202,down,drop
no_issue,0.99657553,2025-10-07T08:18:10.760655,T018,N129,West,91,1.97,457.76,13.33,69.98,138,2,3887,E202,active,reconnect
no_issue,0.99657947,2025-10-19T18:27:12.760655,T017,N051,East,91,0.03,88.48,22.47,21.59,480,2,1408,E101,degraded,congestion
no_issue,0.996555,2025-10-04T23:39:17.760655,T049,N197,East,56,0.29,133.43,20.92,50.77,979,1,7294,E505,active,drop
no_issue,0.9966184,2025-10-20T04:23:56.760655,T020,N119,West,38,0.27,84.29,66.43,45.0,808,2,109,,active,congestion
latency_spike,0.862484,2025-10-08T15:03:52.760655,T034,N169,North,530,23.41,3.77,99.79,95.9,1552,7,16,,active,drop
no_issue,0.9966479,2025-10-09T13:47:38.760655,T047,N141,East,71,1.0,320.27,13.75,63.27,311,1,7380,E303,degraded,reconnect
no_issue,0.9966989,2025-10-22T21:51:09.760655,T023,N106,East,87,0.35,480.16,14.22,41.3,508,2,1320,,degraded,drop
no_issue,0.9962935,2025-09-29T16:42:00.760655,T021,N176,East,36,1.89,232.91,56.31,49.03,528,0,2786,E202,degraded,congestion
no_issue,0.99630463,2025-09-30T04:14:49.760655,T023,N003,West,30,1.51,257.24,60.52,63.71,746,2,8889,E101,active,normal
no_issue,0.9967014,2025-10-18T23:51:10.760655,T024,N004,East,84,1.52,114.74,10.52,21.2,125,2,801,E202,down,congestion
connection_drop,0.33400425,2025-10-07T02:12:14.760655,T044,N078,West,308,25.71,7.94,95.56,98.7,1742,6,31,E505,down,reconnect
outage,0.4308096,2025-10-19T23:46:05.760655,T014,N040,East,407,16.95,15.37,99.71,98.71,1637,9,20,E303,degraded,reconnect
packet_loss,0.67141974,2025-10-09T17:52:55.760655,T042,N053,East,529,19.86,14.69,92.39,95.39,1710,8,26,E303,down,reconnect
no_issue,0.9966967,2025-10-10T14:38:25.760655,T007,N175,South,54,1.39,356.06,47.12,65.16,106,0,656,,degraded,drop
no_issue,0.9965783,2025-10-18T12:07:05.760655,T016,N089,East,20,0.41,402.07,54.07,38.03,313,0,7005,E101,degraded,reconnect
outage,0.6399564,2025-10-20T07:04:00.760655,T024,N060,North,373,29.95,1.54,99.08,96.6,1619,6,17,E505,active,congestion
no_issue,0.99667144,2025-10-08T03:25:51.760655,T020,N097,South,14,0.5,327.72,52.41,30.02,383,0,3278,E404,down,drop`;

function getStatusBadgeVariant(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "success";
    case "degraded":
      return "warning";
    case "down":
      return "danger";
    default:
      return "default";
  }
}

function getIssueTypeBadgeVariant(
  issueType: string
): "success" | "warning" | "danger" {
  if (issueType === "no_issue") return "success";
  if (["latency_spike", "packet_loss"].includes(issueType)) return "warning";
  return "danger";
}

function formatTimestamp(timestamp: string) {
  try {
    return new Date(timestamp).toLocaleString();
  } catch {
    return timestamp;
  }
}

export default function Home() {
  const [events, setEvents] = useState<NetworkEvent[]>(() => {
    try {
      return parseCSV(csvData);
    } catch (error) {
      console.error("Error parsing CSV:", error);
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.tower_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.node_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.issue_type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        event.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesRegion =
        regionFilter === "all" ||
        event.region.toLowerCase() === regionFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [events, searchQuery, statusFilter, regionFilter]);

  const stats = useMemo(() => {
    const total = events.length;
    const active = events.filter(
      (e) => e.status.toLowerCase() === "active"
    ).length;
    const degraded = events.filter(
      (e) => e.status.toLowerCase() === "degraded"
    ).length;
    const down = events.filter((e) => e.status.toLowerCase() === "down").length;
    const avgLatency = events.reduce((sum, e) => sum + e.latency_ms, 0) / total;
    const avgThroughput =
      events.reduce((sum, e) => sum + e.throughput_mbps, 0) / total;
    const issues = events.filter((e) => e.issue_type !== "no_issue").length;

    return { total, active, degraded, down, avgLatency, avgThroughput, issues };
  }, [events]);

  const uniqueRegions = useMemo(() => {
    return Array.from(new Set(events.map((e) => e.region))).sort();
  }, [events]);

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-[#0d0d0d] p-6'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-zinc-900 dark:text-zinc-50'>
              Network Monitoring Dashboard
            </h1>
            <p className='text-zinc-600 dark:text-zinc-400 mt-1'>
              Real-time network infrastructure monitoring
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <StatisticsCard {...stats} />
          <div className='w-full'>
            <Card className='w-full'>
              <CardContent className='p-6'>
                <MarkdownViewer
                  className='h-[440px] overflow-y-auto'
                  content={`# Network Anomaly Summary from CSV Data

## General Summary

The dataset contains network telemetry data with potential issues labeled in the 'issue_type' column. Most records (18 out of 24) are classified as "no_issue", indicating the network is primarily functioning normally. A few specific network anomalies have been identified.

## Key Network Anomalies

### 1. **Latency Spikes**

Occurrences where latency exceeded the typical range:
- **T003 (N118 - West region) on 2025-10-19**: Latency = 503ms, Probability = 0.62
- **T034 (N169 - North region) on 2025-10-08**: Latency = 530ms, Probability = 0.86 (most likely to indicate a real latency issue)

### 2. **Resource Exhaustion**

Significant high CPU and memory usage:
- **T044 (N188 - West region) on 2025-10-25**: CPU = 96.16%, Memory = 96.09%, Throughput = 2.28Mbps, Probability = 0.41

### 3. **Packet Loss**

High packet loss affecting network performance:
- **T013 (N186 - West region) on 2025-10-17**: Packet Loss = 13.47%, Throughput = 1.4Mbps, CPU = 94.24%, Memory = 98.05%, Probability = 0.78
- **T042 (N053 - East region) on 2025-10-09**: Packet Loss = 19.86%, Probability = 0.67

### 4. **Connection Drops/Outages**

Events indicating potential or confirmed outages:
- **T044 (N078 - West region) on 2025-10-07**: Probability = 0.33
- **T014 (N040 - East region) on 2025-10-19**: Probability = 0.43
- **T024 (N060 - North region) on 2025-10-20**: Probability = 0.64

### 5. **Error Codes**

Frequent error codes observed:
- **E101**: 4 instances
- **E202**: 5 instances
- **E303**: 3 instances
- **E404**: 1 instance
- **E505**: 2 instances

### 6. **Reconnection Events**

Several reconnection attempts were recorded, typically linked to network degradation:
- T003 (N118 - West region), T044 (N188 - West region), and T042 (N053 - East region) had reconnection events with high CPU/memory usage.

## Regional Analysis

- **West region**: Highest concentration of network issues (latency spikes, packet loss, and reconnection events).
- **East and North regions**: Moderate issues with occasional outages.
- **South region**: Fewer issues reported compared to other regions.

## Recommendations

1. **Investigate Latency Issues**: T003, T034, and other devices showing latency spikes require thorough diagnosis to avoid performance bottlenecks.

2. **Manage Resource Usage**: Devices T044 (N188) and T013 (N186) show high CPU and memory usage that could lead to further issues.

3. **Address Packet Loss**: T013 (N186) and T042 (N053) in the West and East regions need investigation to resolve routing or congestion problems.

4. **Monitor Outages**: T044, T014, and T024 had outages or connection drops that need investigation into root causes.

5. **Error Code Analysis**: E101, E202, and E303 are commonly reported errors. Consider their frequency and context to understand underlying patterns in device behavior.

These findings can help network administrators prioritize remediation actions to ensure stable network performance.`}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Network Events</CardTitle>
            <CardDescription>
              Monitor and filter network infrastructure events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col md:flex-row gap-4 mb-6'>
              <div className='flex-1 relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search by tower, node, region, or issue type...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className='h-10 rounded-md border border-input bg-background px-3 py-2 text-sm'
              >
                <option value='all'>All Status</option>
                <option value='active'>Active</option>
                <option value='degraded'>Degraded</option>
                <option value='down'>Down</option>
              </select>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className='h-10 rounded-md border border-input bg-background px-3 py-2 text-sm'
              >
                <option value='all'>All Regions</option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Data Table */}
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Tower</TableHead>
                    <TableHead>Node</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Issue Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Latency (ms)</TableHead>
                    <TableHead>Throughput (Mbps)</TableHead>
                    <TableHead>CPU %</TableHead>
                    <TableHead>Memory %</TableHead>
                    <TableHead>Error Code</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        className='text-center text-muted-foreground py-8'
                      >
                        No events found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEvents.map((event, index) => (
                      <TableRow key={index}>
                        <TableCell className='font-mono text-xs'>
                          {formatTimestamp(event.timestamp)}
                        </TableCell>
                        <TableCell>{event.tower_id}</TableCell>
                        <TableCell>{event.node_id}</TableCell>
                        <TableCell>{event.region}</TableCell>
                        <TableCell>
                          <Badge
                            variant={getIssueTypeBadgeVariant(event.issue_type)}
                          >
                            {event.issue_type.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(event.status)}>
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{event.latency_ms}</TableCell>
                        <TableCell>
                          {event.throughput_mbps.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {event.cpu_usage_percent.toFixed(2)}%
                        </TableCell>
                        <TableCell>
                          {event.memory_usage_percent.toFixed(2)}%
                        </TableCell>
                        <TableCell>
                          {event.error_code || (
                            <span className='text-muted-foreground'>—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className='mt-4 text-sm text-muted-foreground'>
              Showing {filteredEvents.length} of {events.length} events
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
