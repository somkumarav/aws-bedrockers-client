export interface NetworkEvent {
  issue_type: string;
  probability: number;
  timestamp: string;
  tower_id: string;
  node_id: string;
  region: string;
  latency_ms: number;
  packet_loss_percent: number;
  throughput_mbps: number;
  cpu_usage_percent: number;
  memory_usage_percent: number;
  disk_io: number;
  retry_count: number;
  connection_duration_sec: number;
  error_code: string;
  status: string;
  event_type: string;
}

export function parseCSV(fileContent: string): NetworkEvent[] {
  const lines = fileContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const data: NetworkEvent[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',').map(v => v.trim());
    const record: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      
      // Parse numeric fields
      if (['probability', 'latency_ms', 'packet_loss_percent', 'throughput_mbps', 
           'cpu_usage_percent', 'memory_usage_percent', 'disk_io', 'retry_count', 
           'connection_duration_sec'].includes(header)) {
        record[header] = value ? parseFloat(value) : 0;
      } else {
        record[header] = value;
      }
    });
    
    data.push(record as NetworkEvent);
  }
  
  return data;
}

